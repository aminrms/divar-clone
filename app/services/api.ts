// services/api.ts
// Exports a single axios instance (apiClient) with:
//   - Request interceptor  → inject Bearer token from authStore
//   - Response interceptor → 401 refresh + concurrent retry queue, 403 log, force logout

import axios from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios'

// Extend config to track whether this request has already been retried
interface RetryableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

// ─── Refresh queue ────────────────────────────────────────────────────────────
// When a refresh is in-flight, all other 401s are parked here.
// Once the new token arrives they all retry at once.
let isRefreshing = false
let refreshQueue: Array<{
  resolve: (token: string) => void
  reject: (err: unknown) => void
}> = []

const processQueue = (newToken: string) => {
  refreshQueue.forEach(({ resolve }) => resolve(newToken))
  refreshQueue = []
}

const flushQueue = (error: unknown) => {
  refreshQueue.forEach(({ reject }) => reject(error))
  refreshQueue = []
}

// ─── Factory ──────────────────────────────────────────────────────────────────
const createClient = (): AxiosInstance => {
  const config = useRuntimeConfig()

  const client = axios.create({
    baseURL: config.public.apiBase as string,
    timeout: 15_000,
    headers: { 'Content-Type': 'application/json' },
  })

  // ── REQUEST: attach Bearer token ───────────────────────────────────────────
  client.interceptors.request.use(
    (reqConfig: InternalAxiosRequestConfig) => {
      // useAuthStore is imported lazily to avoid circular-dep at module init
      const { useAuthStore } = require('@/stores/auth')
      const authStore = useAuthStore()

      if (authStore.accessToken) {
        reqConfig.headers['Authorization'] = `Bearer ${authStore.accessToken}`
      }

      return reqConfig
    },
    (error) => Promise.reject(error)
  )

  // ── RESPONSE: handle errors ────────────────────────────────────────────────
  client.interceptors.response.use(
    (response) => response, // 2xx → pass through

    async (error) => {
      const originalRequest = error.config as RetryableConfig
      const status: number | undefined = error.response?.status

      const { useAuthStore } = require('@/stores/auth')
      const authStore = useAuthStore()

      // ── 401 → try token refresh ──────────────────────────────────────────
      if (status === 401 && !originalRequest._retry) {

        if (isRefreshing) {
          // Park this request and resolve it once the refresh finishes
          return new Promise<string>((resolve, reject) => {
            refreshQueue.push({ resolve, reject })
          })
            .then((newToken) => {
              originalRequest.headers['Authorization'] = `Bearer ${newToken}`
              return client(originalRequest)
            })
            .catch((err) => Promise.reject(err))
        }

        originalRequest._retry = true
        isRefreshing = true

        try {
          const newToken = await authStore.refreshAccessToken() // throws if refresh fails
          processQueue(newToken)
          isRefreshing = false

          originalRequest.headers['Authorization'] = `Bearer ${newToken}`
          return client(originalRequest) // retry original with new token
        } catch (refreshError) {
          isRefreshing = false
          flushQueue(refreshError)
          await authStore.logout()
          await navigateTo('/auth/login')
          return Promise.reject(refreshError)
        }
      }

      // ── 403 → no permission ──────────────────────────────────────────────
      if (status === 403) {
        console.error(`[API] 403 Forbidden → ${originalRequest.url}`)
        // Optionally: navigateTo('/forbidden')
      }

      // ── Network error (no response at all) ───────────────────────────────
      if (!error.response) {
        console.error('[API] Network error — server unreachable')
      }

      return Promise.reject(error)
    }
  )

  return client
}

// ─── Singleton ────────────────────────────────────────────────────────────────
// One instance across the entire app — interceptors registered once.
let _client: AxiosInstance | null = null

export const apiClient = (): AxiosInstance => {
  if (!_client) _client = createClient()
  return _client
}
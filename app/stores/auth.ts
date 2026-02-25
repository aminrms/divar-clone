// stores/auth.ts
// Uses apiClient() for all HTTP — token is injected automatically by the interceptor.
// refreshAccessToken uses raw axios (no interceptor) to avoid an infinite 401 loop.

import { defineStore } from 'pinia'
import axios from 'axios'
import { apiClient } from '@/services/api'
import { LOCAL_STORAGE_KEYS } from '~/constants/storage'
import type { AuthResponse } from '~/types/auth.types'
import type { User } from '~/types/user.types'
import {
  setCookie,
  removeCookie,
  getLocalStorage,
  setLocalStorage,
  removeLocalStorage,
} from '~/utils/storage'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: User | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    accessToken: null,
    refreshToken: null,
    user: null,
  }),

  getters: {
    isAuthenticated: (state): boolean => !!state.accessToken,
    currentUser: (state): User | null => state.user,
  },

  actions: {
    // ── Init (call on app startup) ───────────────────────────────────────────
    // Rehydrates tokens from localStorage so the interceptor can pick them up.
    initAuth() {
      this.accessToken = getLocalStorage<string>(LOCAL_STORAGE_KEYS.ACCESS_TOKEN)
      this.refreshToken = getLocalStorage<string>('refresh_token')
      this.user = getLocalStorage<User>(LOCAL_STORAGE_KEYS.USER_INFO)
    },

    // ── Login ────────────────────────────────────────────────────────────────
    async login(email: string, password: string): Promise<AuthResponse> {
      // const { data } = await apiClient().post<AuthResponse>('/auth/login', { email, password })

      // this.setTokens(data.accessToken, data.refreshToken)
      // this.user = data.user
      // setLocalStorage(LOCAL_STORAGE_KEYS.USER_INFO, data.user)
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate network delay
      const data: AuthResponse = {
        accessToken: 'mocked-access-token',
        refreshToken: 'mocked-refresh-token',
        user: {
          id: 1,
          name: 'John Doe',
          email: 'Kx9dD@example.com',
          role: 'admin',
          createdAt: '2022-01-01T00:00:00.000Z',
          updatedAt: '2022-01-01T00:00:00.000Z',
        }
      }
      this.setTokens(data.accessToken, data.refreshToken)
      this.user = data.user
      setLocalStorage(LOCAL_STORAGE_KEYS.USER_INFO, data.user)
      

      return data
    },

    // ── Register ─────────────────────────────────────────────────────────────
    async register(name: string, email: string, password: string): Promise<AuthResponse> {
      // const { data } = await apiClient().post<AuthResponse>('/auth/register', { name, email, password })

      // this.setTokens(data.accessToken, data.refreshToken)
      // this.user = data.user
      // setLocalStorage(LOCAL_STORAGE_KEYS.USER_INFO, data.user)

      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate network delay
      const data: AuthResponse = {
        accessToken: 'mocked-access-token',
        refreshToken: 'mocked-refresh-token',
        user: {
          id: 1,
          name: 'John Doe',
          email: 'Kx9dD@example.com',
          role: 'admin',
          createdAt: '2022-01-01T00:00:00.000Z',
          updatedAt: '2022-01-01T00:00:00.000Z',
        }
      }
      this.setTokens(data.accessToken, data.refreshToken)
      this.user = data.user
      setLocalStorage(LOCAL_STORAGE_KEYS.USER_INFO, data.user)
      return data
    },

    // ── Refresh access token ─────────────────────────────────────────────────
    // Uses a plain axios call (NOT apiClient) to avoid triggering the
    // response interceptor and causing an infinite retry loop.
    async refreshAccessToken(): Promise<string> {
      if (!this.refreshToken) throw new Error('No refresh token available')

      const config = useRuntimeConfig()

      const { data } = await axios.post<AuthResponse>(
        `${config.public.apiBase}/auth/refresh`,
        { refreshToken: this.refreshToken }
      )

      const nextRefresh = data.refreshToken ?? this.refreshToken!
      this.setTokens(data.accessToken, nextRefresh)
      return data.accessToken
    },

    // ── Fetch current user ───────────────────────────────────────────────────
    async fetchMe(): Promise<User> {
      const { data } = await apiClient().get<User>('/auth/me')

      this.user = data
      setLocalStorage(LOCAL_STORAGE_KEYS.USER_INFO, data)
      return data
    },

    // ── Logout ───────────────────────────────────────────────────────────────
    async logout(): Promise<void> {
      try {
        if (this.accessToken) {
          await apiClient().post('/auth/logout')
        }
      } catch {
        // Ignore — clear state regardless
      } finally {
        this.clearTokens()
      }
    },

    // ── Set tokens ───────────────────────────────────────────────────────────
    setTokens(accessToken: string, refreshToken: string | null): void {
      this.accessToken = accessToken
      this.refreshToken = refreshToken

      // localStorage — tab sync + rehydration on reload
      setLocalStorage(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, accessToken)
      if (refreshToken) setLocalStorage(LOCAL_STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
    },

    // ── Clear tokens ─────────────────────────────────────────────────────────
    clearTokens(): void {
      this.accessToken = null
      this.refreshToken = null
      this.user = null

      removeCookie(LOCAL_STORAGE_KEYS.ACCESS_TOKEN)
      removeCookie('refresh_token')

      removeLocalStorage(LOCAL_STORAGE_KEYS.ACCESS_TOKEN)
      removeLocalStorage('refresh_token')
      removeLocalStorage(LOCAL_STORAGE_KEYS.USER_INFO)
    },
  },
})
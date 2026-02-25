// composables/mutations/useAuthMutations.ts
// Login, register, logout mutations — consumed by pages directly.

import { useMutation, useQueryClient } from '@tanstack/vue-query'
import type { LoginPayload, RegisterPayload } from '~/types/auth.types'

// ─── Login ────────────────────────────────────────────────────────────────────
export const useLogin = () => {
  const authStore = useAuthStore()
  const queryClient = useQueryClient()
  const route = useRoute()

  return useMutation({
    mutationFn: ({ email, password }: LoginPayload) =>
      authStore.login(email, password),

    onSuccess: () => {
      queryClient.clear() // wipe any cache from a previous session
      const redirect = route.query.redirect as string | undefined
      navigateTo(redirect || '/', { replace: true })
    },
  })
}

// ─── Register ─────────────────────────────────────────────────────────────────
export const useRegister = () => {
  const authStore = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ name, email, password }: RegisterPayload) =>
      authStore.register(name, email, password),

    onSuccess: () => {
      queryClient.clear()
      navigateTo('/', { replace: true })
    },
  })
}

// ─── Logout ───────────────────────────────────────────────────────────────────
export const useLogout = () => {
  const authStore = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => authStore.logout(),

    onSettled: () => {
      queryClient.clear() // always clear, even if logout API call fails
      navigateTo('/auth/login', { replace: true })
    },
  })
}
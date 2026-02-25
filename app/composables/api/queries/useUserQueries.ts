// composables/queries/useUserQueries.ts
// All READ operations for users — uses apiClient() directly.

import { useQuery } from '@tanstack/vue-query'
import { apiClient } from '@/services/api'
import { queryKeys } from './queryKeys'
import type { User, UsersListResponse, UserFilters } from '~/types/user.types'

// ─── Get all users (with optional reactive filters) ───────────────────────────
export const useUsersQuery = (filters?: Ref<UserFilters>) => {
  return useQuery({
    queryKey: computed(() => queryKeys.users.list(filters?.value as any)),
    queryFn: async () => {
      const { data } = await apiClient().get<UsersListResponse>('/users', {
        params: filters?.value,
      })
      return data
    },
    staleTime: 1000 * 60 * 2,
  })
}

// ─── Get single user ──────────────────────────────────────────────────────────
export const useUserQuery = (id: Ref<number | null>) => {
  return useQuery({
    queryKey: computed(() => queryKeys.users.detail(id.value!)),
    queryFn: async () => {
      const { data } = await apiClient().get<User>(`/users/${id.value}`)
      return data
    },
    enabled: computed(() => !!id.value),
    staleTime: 1000 * 60 * 5,
  })
}

// ─── Get current user (me) ────────────────────────────────────────────────────
export const useMeQuery = () => {
  const authStore = useAuthStore()

  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: async () => {
      const { data } = await apiClient().get<User>('/auth/me')
      return data
    },
    enabled: computed(() => authStore.isAuthenticated),
    staleTime: 1000 * 60 * 10,
  })
}
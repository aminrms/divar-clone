// types/user.ts

export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user'
  createdAt: string
  updatedAt: string
}

export interface CreateUserPayload {
  name: string
  email: string
  password: string
  role?: 'admin' | 'user'
}

export interface UpdateUserPayload {
  id: number
  name?: string
  email?: string
  role?: 'admin' | 'user'
}

export interface UsersListResponse {
  data: User[]
  total: number
  page: number
  perPage: number
}

export interface UserFilters {
  page?: number
  perPage?: number
  search?: string
  role?: 'admin' | 'user'
}
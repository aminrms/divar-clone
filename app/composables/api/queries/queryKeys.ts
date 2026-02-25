// composables/queries/queryKeys.ts
// Single source of truth for all cache keys.
// Like Redux slice names — changing a key here invalidates everywhere.

export const queryKeys = {
  // ── Users ──────────────────────────────────────────────────────────────────
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.users.lists(), { filters }] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.users.details(), id] as const,
  },

  // ── Auth ───────────────────────────────────────────────────────────────────
  auth: {
    me: ['auth', 'me'] as const,
  },

  // ── Posts (example — add your own features) ────────────────────────────────
  posts: {
    all: ['posts'] as const,
    lists: () => [...queryKeys.posts.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.posts.lists(), { filters }] as const,
    detail: (id: number) => [...queryKeys.posts.all, 'detail', id] as const,
  },
}
// plugins/vue-query.ts
// Registers TanStack Vue Query globally with SSR hydration support

import type { DehydratedState, VueQueryPluginOptions } from '@tanstack/vue-query'
import { VueQueryPlugin, QueryClient, dehydrate, hydrate } from '@tanstack/vue-query'

export default defineNuxtPlugin((nuxt) => {
  const vueQueryState = useState<DehydratedState | null>('vue-query')

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,       // 5 min — data stays fresh
        gcTime: 1000 * 60 * 10,          // 10 min — cache lifetime
        retry: 2,                         // retry failed requests twice
        refetchOnWindowFocus: false,      // don't refetch on tab switch
        refetchOnReconnect: true,         // refetch when internet reconnects
      },
      mutations: {
        retry: 0,                         // never retry mutations
      },
    },
  })

  const options: VueQueryPluginOptions = { queryClient }
  nuxt.vueApp.use(VueQueryPlugin, options)

  // SSR: dehydrate state from server → send to client
  if (import.meta.server) {
    nuxt.hooks.hook('app:rendered', () => {
      vueQueryState.value = dehydrate(queryClient)
    })
  }

  // Client: rehydrate server state into QueryClient
  if (import.meta.client) {
    hydrate(queryClient, vueQueryState.value)
  }
})
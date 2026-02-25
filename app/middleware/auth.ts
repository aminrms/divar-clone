import { LOCAL_STORAGE_KEYS } from '~/constants/storage'
import { useAuthStore } from '~/stores/auth'


export default defineNuxtRouteMiddleware((to) => {
  // process.client ensures this only runs in the browser
  if (import.meta.client) {
    const token = getLocalStorage(LOCAL_STORAGE_KEYS.ACCESS_TOKEN)

    if (!token && to.path !== '/auth/login') {
      window.location.replace('/auth/login')
    }
  }
  
})
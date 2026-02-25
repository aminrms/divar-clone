import type { AxiosInstance } from 'axios'

declare module 'pinia' {
  export interface PiniaCustomProperties {
    // This allows 'this.$api' to be recognized inside store actions
    $api: AxiosInstance
  }
}

export {}
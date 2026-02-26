// nuxt.config.ts
import '@nuxt/image'

export default defineNuxtConfig({
  components: {
    dirs: ['~/components']
  },
  // Enable Nuxt devtools
  devtools: { enabled: true },

  // Register modules
  modules: [
    '@nuxt/ui',
    '@nuxt/image',
    '@pinia/nuxt',
    '@nuxtjs/seo',
    'nuxt-security',
    '@vueuse/nuxt',
    '@nuxt/icon',
    '@nuxtjs/i18n'
  ],
  colorMode: {
    preference: 'light', // Force light mode
    fallback: 'light',
    storageKey: 'nuxt-color-mode'

  },
  // Runtime config (private + public env vars)
  runtimeConfig: {
    apiSecret: process.env.API_SECRET,
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
      reverbHost: process.env.REVERB_HOST,
      reverbKey: process.env.REVERB_APP_KEY,
      reverbPort: process.env.REVERB_PORT ?? '8080',
      cdnBase: process.env.CDN_URL,
    },
  },

  // Per-route rules (SSR / CSR / ISR / Prerender)
  routeRules: {
    '/': { ssr: true, cache: { maxAge: 10 } },
    '/auth/**': { ssr: false },
  },

  // Pinia plugin options
  pinia: {
    storesDirs: ['./stores/**'],
  },

  // Global CSS imports
  css: ['~/assets/css/main.css', '~/assets/css/themes.css'],

  // Performance / Experimental features
  experimental: {
    payloadExtraction: true,
    renderJsonPayloads: true,
  },
  // PostCSS configuration
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
      autoprefixer: {},
    },
  },

  // i18n configuration

  i18n: {
    defaultLocale: 'en',
    strategy: 'no_prefix',
    autoDeclare: false,
    detectBrowserLanguage: false,

    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'fa', name: 'Persian', file: 'fa.json' },
    ]
  },

  // Auto-import composables, stores, etc.
  imports: {
    dirs: [
      'composables/**',
      'stores',
    ],
  },

})
import tailwindcss from "@tailwindcss/vite";

const replitDevDomain = process.env.REPLIT_DEV_DOMAIN;

 // https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  css: ['./app/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
    server: {
      host: '0.0.0.0',
      port: 5000,
      ...(replitDevDomain && {
        origin: `https://${replitDevDomain}`,
        hmr: {
          protocol: 'wss',
          host: replitDevDomain,
          clientPort: 443
        }
      })
    }
  },
  modules: [
    '@nuxt/test-utils/module',
  ],
  devServer: {
    host: '0.0.0.0',
    port: 5000
  },
  routeRules: {
    '/**': {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    }
  }
})

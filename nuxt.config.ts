// https://nuxt.com/docs/api/configuration/nuxt-config
import type { ElectronOptions } from 'nuxt-electron'


// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  css: [
    'vuetify/lib/styles/main.sass',
    '@mdi/font/css/materialdesignicons.css',
    '/node_modules/github-markdown-css/github-markdown-dark.css',
    '/node_modules/highlight.js/styles/github-dark.css'
  ],
  build: {
    transpile: ['vuetify'],
  },
  modules: [
    ['nuxt-electron', <ElectronOptions>{
      include: ['electron'],
    }],
    '@vueuse/nuxt',
  ],
  imports: {
    dirs: ['models'],
  }
})

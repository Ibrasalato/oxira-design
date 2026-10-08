import { defineConfig } from 'astro/config';

export default defineConfig({
  site: process.env.SITE_URL || 'https://design.oxira.sa',
  base: process.env.BASE_PATH || '/',
  trailingSlash: 'ignore',
  build: { inlineStylesheets: 'auto' },
  vite: { build: { chunkSizeWarningLimit: 1200 } },
  i18n: {
    locales: ['ar', 'en', 'de', 'fr', 'ru'],
    defaultLocale: 'ar',
    routing: { prefixDefaultLocale: false },
  },
});

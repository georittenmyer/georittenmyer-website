import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://georittenmyer.com',
  integrations: [sitemap()],
  vite: {
    build: {
      minify: 'terser'
    }
  }
});

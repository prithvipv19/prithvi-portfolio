// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Set by the GitHub Pages workflow (.github/workflows/deploy-site.yml); unset locally.
  site: process.env.SITE_URL || undefined,
  base: process.env.BASE_PATH || undefined,
  integrations: [sitemap()],
  // The Experience page used to be called Resume; keep old links working.
  redirects: { '/resume': `${(process.env.BASE_PATH ?? '').replace(/\/$/, '')}/experience` },
  // In dev, the digital twin's API runs locally (cd twin && npm run dev).
  vite: { server: { proxy: { '/api': 'http://localhost:8787' } } },
});

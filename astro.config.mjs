// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  integrations: [sitemap()],
  // The Experience page used to be called Resume; keep old links working.
  redirects: { '/resume': '/experience' },
});

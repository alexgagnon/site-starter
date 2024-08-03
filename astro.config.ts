import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import lit from '@astrojs/lit';
import { version } from './package.json' with { type: 'json' };

export default defineConfig({
  vite: {
    define: {
      __VERSION__: JSON.stringify(version)
    }
  },
  integrations: [sitemap(), lit()]
});

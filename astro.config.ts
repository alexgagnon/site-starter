import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import lit from '@astrojs/lit';
import { version } from './package.json' with { type: 'json' };

const isProduction = process.env.NODE_ENV === 'production';
export default defineConfig({
  compressHTML: isProduction,
  vite: {
    build: {
      cssMinify: 'lightningcss'
    },
    css: {
      transformer: 'lightningcss',
      lightningcss: {
        drafts: {
          customMedia: true
        }
      }
    },
    define: {
      __VERSION__: JSON.stringify(version)
    }
  },
  integrations: [sitemap(), lit()]
});

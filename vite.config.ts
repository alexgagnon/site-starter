import { defineConfig } from 'vite';
import type { PackageJson } from 'type-fest';
import pkg from './package.json' with { type: 'json' };

const { version } = pkg as PackageJson;

export default defineConfig({
  define: {
    __VERSION__: JSON.stringify(version)
  },
  test: {
    // vitest options...
  }
});

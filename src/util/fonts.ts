import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import config from '../../site.config.json' with { type: 'json' };
import { debug } from './debug.js';
import type { Font } from '../env.js';

type Dirent = {
  name: string;
  path: string;
  isFile: () => boolean;
};

const {
  build: { distDir }
}: { build: { distDir: string } } = config;

export async function getFonts() {
  if (import.meta.env.SSR) {
    debug('SSR mode');
    const baseDir = new URL(
      join('..', '..', distDir, 'fonts'),
      import.meta.url
    );
    return (
      await readdir(baseDir, { recursive: true, withFileTypes: true })
    ).map((dirent: Dirent) => {
      // TODO: could extend for other descriptors, like weight
      const [family, style] = dirent.name
        .replace(/-subset\..*$/, '')
        .split('_');
      return {
        family,
        source: `url("/fonts/${dirent.name}")`,
        descriptors: { style }
      } as Font;
    });
  } else {
    return null;
  }
}

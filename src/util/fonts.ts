import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import config from '../../site.config.json' with { type: 'json' };
import { debug } from './debug.js';
import type { Dirent } from 'node:fs';
import type { Font } from '../env.js';

const {
  build: { publicDir }
}: { build: { publicDir: string } } = config;

export async function getFonts() {
  if (import.meta.env.SSR) {
    debug('SSR mode');
    const baseDir = new URL(
      join('..', '..', publicDir, 'fonts'),
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
        descriptors: { style },
        type: 'font/woff2',
        href: `/fonts/${dirent.name}`
      } as Font;
    });
  } else {
    return null;
  }
}

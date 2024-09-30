import { mkdir, readdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { basename, extname, join } from 'node:path';
import Debug from 'debug';
import {
  checkConfig,
  getFileName,
  type Font,
  type Variant
} from './download-fonts.js';
import config from '../site.config.json' with { type: 'json' };

const debug = Debug('app:subset-fonts');

const {
  fonts,
  build: { rawDir, publicDir }
}: { fonts: Font[]; build: { rawDir: string; publicDir: string } } = config;

const srcDir = join(rawDir, 'fonts');
const distDir = join(publicDir, 'fonts');

checkConfig(fonts);

try {
  // NOTE: this assumes a flat directory structure
  const files = (await readdir(srcDir, { withFileTypes: true })).map(
    (dirent) => {
      const ext = extname(dirent.name);
      const [family, variant] = basename(dirent.name, ext).split('_');
      return { family, variant, path: join(srcDir, dirent.name) };
    }
  );

  if (files.length === 0) {
    console.error(
      `No files found in ${srcDir}, have you downloaded the fonts with \`npm run fonts:download\`?`
    );
    process.exit(1);
  }

  debug(`Files: %O`, files);

  try {
    await mkdir(distDir, { recursive: true });
  } catch (error) {
    console.error(`Could not make directory ${distDir}`);
    debug(error);
    process.exit(1);
  }

  for (const { family, variants } of fonts) {
    for (const [variant, variantConfig] of Object.entries(variants)) {
      // TODO: support other formats
      const path = join(
        srcDir,
        `${getFileName(family, variant as Variant)}.ttf`
      );

      console.log(`Subsetting ${family} ${variant} from ${path}...`);
      debug('Config: %O', config);

      const formats: string = variantConfig.formats ?? 'woff2';

      const args = [
        'glyphhanger',
        `--subset=${path}`,
        `--formats=${formats}`,
        `--output=${distDir}`
      ];

      if (variantConfig.whitelist != null)
        args.push(`--whitelist=${variantConfig.whitelist}`);
      if (variantConfig.subset != null) args.push(`--${variantConfig.subset}`);

      debug(`Running: npx ${args.join(' ')}`);

      const glyphhanger = spawnSync('npx', args);
      if (glyphhanger.error) {
        console.error(glyphhanger.error);
      }
    }
  }
} catch (error) {
  console.error(`Could not read directory ${srcDir}`);
  debug(error);
  process.exit(1);
}

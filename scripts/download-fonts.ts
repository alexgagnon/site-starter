import 'dotenv/config';
import config from '../site.config.json' with { type: 'json' };
import { writeFile, mkdir } from 'node:fs/promises';
import { join, extname } from 'node:path';
import Debug from 'debug';
const debug = Debug('app:download-fonts');

export type Variant = 'regular' | 'italic';

export type SubsetOptions = {
  formats?: string;
  unicodeRange?: string;
  subset?: string;
  whitelist?: string;
};

export interface Font {
  family: string;
  variants: Record<Variant, SubsetOptions>;
  variable?: boolean;
}

interface GoogleFontItem {
  family: string;
  variants: Variant[];
  subsets: string[];
  version: string;
  lastModified: string;
  files: Record<Variant, string>;
  category: string;
  kind: string;
  menu: string;
}

interface GoogleFontsResponse {
  kind: string;
  items: GoogleFontItem[];
}

export function checkConfig(fonts: Font[]) {
  if (!fonts) {
    console.error(
      'No fonts to subset, check the `config.fonts` property in package.json'
    );
    process.exit(1);
  }
}

export function getFileName(family: string, variant: Variant) {
  return `${family}_${variant === 'regular' ? 'normal' : variant}`;
}

const {
  fonts,
  build: { rawDir }
} = config;

const distDir = join(rawDir as string, 'fonts');

checkConfig(fonts as Font[]);

try {
  await mkdir(distDir, { recursive: true });
} catch (error) {
  console.error(`Could not make directory ${distDir}`);
  debug(error);
  process.exit(1);
}

// see https://developers.google.com/fonts/docs/developer_api for schema
for (const font of fonts) {
  const { family, variable } = font;
  const variants = Object.keys(font.variants);
  try {
    console.log(`Getting download links for ${family}...`);
    let query = `key=${process.env.GOOGLE_FONTS_API_KEY}&family=${family}`;
    if (variable === true) query += '&capability=VF';
    const url = `https://www.googleapis.com/webfonts/v1/webfonts?${query}`;

    debug(`Fetching: ${url}`);

    const response = await fetch(url);
    const data = (await response.json()) as GoogleFontsResponse;
    debug(data);

    const files = data.items[0]?.files;
    debug(files);

    if (files != null) {
      await Promise.allSettled(
        Object.entries(files).map(async ([v, url]) => {
          if (variants.includes(v)) {
            console.log(`Downloading ${v}`);
            const font = await fetch(url).then((response) =>
              response.arrayBuffer()
            );

            const fileName = `${getFileName(family, v as Variant)}${extname(url)}`;
            await writeFile(join(distDir, fileName), Buffer.from(font));
          }
        })
      );
    }
  } catch (error) {
    console.error(error);
  }
}

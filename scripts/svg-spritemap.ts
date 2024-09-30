import { readFileSync } from 'node:fs';
import { readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import SVGSpriter from 'svg-sprite';

import { type Dirent } from 'node:fs';

const svgDir = join('raw', 'svg');
const spritesDir = join(svgDir, 'sprites');

const folders = (await readdir(spritesDir, { withFileTypes: true })).filter((dirent: Dirent) => dirent.isDirectory());
console.log(folders);

await Promise.allSettled(folders.map(async (folder: Dirent) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const spriter = new SVGSpriter({
    dest: svgDir,
    mode: {
      symbol: true
    },
    // transform: ['svgo']
  } as SVGSpriter.Config);

  const files = await readdir(join(spritesDir, folder.name), { withFileTypes: true });

  files.forEach((file) => {
    if (file.isFile() && file.name.endsWith('.svg')) {
      const path = join(file.path, file.name);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      spriter.add(path, file.name, readFileSync(path, 'utf-8'));
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  spriter.compile(async (error, result) => {
    if (error) {
      console.error(error);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      await writeFile(join(svgDir, `${folder.name}.svg`), result.symbol.sprite.contents as string);
    }
  });
}));

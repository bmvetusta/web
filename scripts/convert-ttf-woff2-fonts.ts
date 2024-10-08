import { mkdir, readdir } from 'node:fs/promises';
import { basename, dirname, join } from 'node:path';
import ttf2woff2 from 'ttf2woff2';

const fontsBasePath = '../public/assets/fonts/alumni/ttf';
const fontsPathUrl = new URL(fontsBasePath, import.meta.url);
const fontsPath = Bun.fileURLToPath(fontsPathUrl);
const files = await readdir(fontsPath).then((files) => files.map((f) => join(fontsPath, f)));
// const input = await readFile('font.ttf');

const baseDir = join(dirname(dirname(files.at(0) ?? '')), 'woff2');
await mkdir(baseDir, { recursive: true });

for (const inputFontPath of files) {
  const destFilename = basename(inputFontPath, '.ttf') + '.woff2';
  const destFilePath = join(baseDir, destFilename);
  try {
    console.log(`· Converting ${basename(inputFontPath)}...`);
    const inputFontBuff: Buffer = await Bun.file(inputFontPath)
      .arrayBuffer()
      .then((buf) => Buffer.from(buf));

    const woff2FontBuff = ttf2woff2(inputFontBuff).buffer;
    if (!woff2FontBuff) {
      throw new Error('Error while converting font');
    }
    await Bun.write(destFilePath, woff2FontBuff);
    console.log(`\t\tConverted to ${basename(destFilePath)}`);
  } catch (e) {
    console.error(e);
  }
}

// await writeFile('font.woff2', ttf2woff2(input));

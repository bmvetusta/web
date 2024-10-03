import { readFile } from 'node:fs/promises';
import { getWeightNumberByName } from './get-weight-number-by-name';

const isVercel = process.env.VERCEL === '1';
// const prePath = isVercel ? '../../../..' : '../../public';
const prePath = isVercel ? '' : '/public';
export async function getFontOptionsFromFontPaths(...fontPaths: string[]) {
  return await Promise.all(
    fontPaths.map(async (fontPath) => {
      const fontFilePathLowerCase = fontPath.toString().toLocaleLowerCase('es-ES');
      const name = 'Alumni Sans';
      const weight = getWeightNumberByName(fontPath.toString());
      const style = fontFilePathLowerCase.includes('italic') ? 'italic' : 'normal';
      const url = process.cwd() + prePath + fontPath;
      const data = await readFile(url); // Font as buffer
      // const data = await fetch(fontPath).then((res) => res.arrayBuffer());
      // const require = createRequire(import.meta.url);

      return {
        name,
        data,
        weight,
        style,
      } as any;
    })
  );
}

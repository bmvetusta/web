// import { readFile } from 'node:fs/promises';
// import { createRequire } from 'node:module';
import { getWeightNumberByName } from './get-weight-number-by-name';

export async function getFontOptionsFromFontPaths(...fontPaths: (URL | string)[]) {
  return await Promise.all(
    fontPaths.map(async (fontPath) => {
      const fontFilePathLowerCase = fontPath.toString().toLocaleLowerCase('es-ES');
      const name = 'Alumni Sans';
      const weight = getWeightNumberByName(fontPath.toString());
      const style = fontFilePathLowerCase.includes('italic') ? 'italic' : 'normal';
      // const require = createRequire(import.meta.url);
      // const resolvedFontPath = require.resolve(fontPath);
      // const data = await readFile(resolvedFontPath); // Font as buffer
      const data = await fetch(fontPath).then((res) => res.arrayBuffer());

      return {
        name,
        data,
        weight,
        style,
      } as any;
    })
  );
}

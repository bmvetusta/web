import { getWeightNumberByName } from './get-weight-number-by-name';

export async function getFontOptionsFromFontPaths(...fontPaths: URL[]) {
  return await Promise.all(
    fontPaths.map(async (fontPath) => {
      const fontFilePathLowerCase = fontPath.toString().toLocaleLowerCase('es-ES');
      const name = 'Alumni Sans';
      const weight = getWeightNumberByName(fontPath.toString());
      const style = fontFilePathLowerCase.includes('italic') ? 'italic' : 'normal';
      // const data = await readFile(fontPath); // Font as buffer
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

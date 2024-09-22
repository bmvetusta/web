export function getWeightNumberByName(fileLower: string) {
  if (fileLower.includes('extrablack') || fileLower.includes('ultrablack')) return 950;
  if (fileLower.includes('black') || fileLower.includes('heavy')) return 900;
  if (fileLower.includes('extrabold') || fileLower.includes('extrabold')) return 800;
  if (fileLower.includes('bold')) return 700;
  if (fileLower.includes('emibold')) return 600; // Semi || Demi
  if (fileLower.includes('medium')) return 500;
  if (fileLower.includes('normal') || fileLower.includes('regular')) return 400;
  if (fileLower.includes('light')) return 300;
  if (fileLower.includes('extralight') || fileLower.includes('ultralight')) return 200;
  if (fileLower.includes('thin') || fileLower.includes('hairline')) return 100;

  return 400;
}

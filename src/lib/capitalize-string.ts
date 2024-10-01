export function capitalizeString(
  str: string,
  all = true, // Each word separated by space or hypen
  locales: Intl.LocalesArgument = 'es-ES'
): string {
  if (str.includes('-')) {
    if (all === true) {
      return str
        .split('-')
        .map((w) => capitalizeString(w, all))
        .join('-');
    }

    const [first, ...odd] = str.split('-');
    return `${capitalizeString(first, false, locales)}-${odd.join('-').toLocaleLowerCase(locales)}`;
  }

  const chunks = str.split(' ');

  if (chunks.length === 0) {
    return str;
  }

  if (!all) {
    const [firstLetter, ...otherLetters] = chunks[0].toLocaleLowerCase(locales).split('');

    return `${firstLetter.toLocaleUpperCase(locales)}${otherLetters.join('')} ${chunks
      .slice(1)
      .map((c) => c.toLocaleLowerCase(locales))
      .join(' ')}`.trim();
  }

  return chunks.map((word) => capitalizeString(word, false, locales)).join(' ');
}

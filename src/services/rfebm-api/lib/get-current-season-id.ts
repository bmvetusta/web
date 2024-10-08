function twoDigitStringYear(year: number | string) {
  return year.toString().slice(2);
}

export function getCurrentSeasonId() {
  const now = new Date();
  const month = now.getMonth();
  const currentYear = now.getFullYear();

  if (month > 5) {
    const nextYear = currentYear + 1;
    return `${twoDigitStringYear(currentYear)}${twoDigitStringYear(nextYear)}`;
  }

  const prevYear = currentYear - 1;

  return `${twoDigitStringYear(prevYear)}${twoDigitStringYear(currentYear)}`;
}

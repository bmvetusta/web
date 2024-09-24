export function getWeekDayName(day: number | string) {
  if (day == 1) {
    return 'Lunes';
  }

  if (day == 2) {
    return 'Martes';
  }

  if (day == 3) {
    return 'Miércoles';
  }

  if (day == 4) {
    return 'Jueves';
  }

  if (day == 5) {
    return 'Viernes';
  }

  if (day == 6) {
    return 'Sábado';
  }

  if (day == 7 || day == 0) {
    return 'Domingo';
  }

  const n = +day;
  if (Number.isNaN(n)) {
    return null;
  }

  return getWeekDayName(n % 7);
}

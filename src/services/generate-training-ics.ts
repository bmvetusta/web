import { z } from 'astro:schema';
import type { scheduleSchema, trainingSchema } from 'src/schema/training';
import { getWeekDayName } from 'src/services/get-week-day-name';

type Schedule = z.infer<typeof scheduleSchema>;
type PlaceToTrain = z.infer<typeof trainingSchema>;

const officialHolidayDatesOviedo = [
  // 12 Oct
  '20241012',

  // 01 Nov
  '20241101',

  // Constitution
  '20241206',
  '20241209',

  // Chrismas
  '20241223',
  '20241224',
  '20241225',
  '20241226',
  '20241227',
  '20241228',
  '20241229',
  '20241230',
  '20241231',
  '20250101',
  '20250102',
  '20250103',
  '20250104',
  '20250105',
  '20250106',
  '20250107',

  // Holy week
  '20250412',
  '20250413',
  '20250414',
  '20250415',
  '20250416',
  '20250417',
  '20250418',
  '20250419',
  '20250420',

  // Workers day
  '20250501',

  // Local holiday
  '20250521',
];

function weekDaysAsFreq(weekDays: number[] | number): string {
  if (Array.isArray(weekDays)) {
    return weekDays.map(weekDaysAsFreq).join(',');
  }

  if (weekDays === 1) {
    return 'MO';
  }

  if (weekDays === 2) {
    return 'TU';
  }

  if (weekDays === 3) {
    return 'WE';
  }

  if (weekDays === 4) {
    return 'TH';
  }

  if (weekDays === 5) {
    return 'FR';
  }

  if (weekDays === 6) {
    return 'SA';
  }

  return 'SU';
}

const conjunctionList = new Intl.ListFormat('es', {
  style: 'short',
  type: 'conjunction',
});

function generateTrainingICSSchedule(
  { id, address, startDate, endDate }: Omit<PlaceToTrain, 'schedules'> | PlaceToTrain,
  schedule: Schedule,
  excludeDates?: string[]
) {
  const dateStart = startDate.replaceAll('-', '');
  const timeStart = schedule.start.replaceAll(':', '');
  const dateEnd = endDate.replaceAll('-', '');
  const timeEnd = schedule.end.replaceAll(':', '');
  const byday = weekDaysAsFreq(schedule.weekDays);
  const weekDaysList = schedule.weekDays.map(getWeekDayName).filter((w) => !!w);
  const weekDays = conjunctionList.format(weekDaysList);
  const description = `Entrenamiento de balonmano los ${weekDays} de ${schedule.start} a ${schedule.end} con el Club Balonmano Vetusta`;
  let exclude = `EXDATE;TZID=Europe/Madrid:${officialHolidayDatesOviedo.map((h) => `${h}T${timeStart}00`).join(',')}`;
  if (excludeDates && excludeDates.length > 0) {
    exclude += `,${excludeDates.map((e) => `${e}T${timeStart}00`).join(',')}`;
  }

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Club Balonmano Vetusta//NONSGML v1.0//ES
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:event-training-${id}@balonmanovetusta.com
DTSTAMP:${dateStart}T000000Z
DTSTART;TZID=Europe/Madrid:${dateStart}T${timeStart}00
DTEND;TZID=Europe/Madrid:${dateStart}T${timeEnd}00
RRULE:FREQ=WEEKLY;BYDAY=${byday};UNTIL=${dateEnd}T${timeEnd}00Z
${exclude}
SUMMARY:Entrenamiento de Balonmano
LOCATION:${address}
DESCRIPTION:${description}
BEGIN:VALARM
ACTION:DISPLAY
DESCRIPTION:Recordatorio: Entrenamiento de balonmano
TRIGGER:-PT30M
END:VALARM
END:VEVENT
END:VCALENDAR
`;
}

export function generateTrainingICS(training: PlaceToTrain) {
  const { schedules, ...trainingPlace } = training;
  trainingPlace.address = `${trainingPlace.place}, ${trainingPlace.address}`;

  const ics = schedules
    .map((schedule: Schedule) => generateTrainingICSSchedule(training, schedule))
    .join('\n\n');

  return ics;
}

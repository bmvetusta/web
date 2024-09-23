import type { APIContext } from 'astro';
import places from '../../assets/data/training-schedules.json';
import { getWeekDayName } from '../../components/TrainingPlace/get-week-day-name';
import type {
  PlaceToTrain,
  Schedule,
} from '../../components/TrainingPlace/TrainingPlaceList.astro';

function findPlace(place?: string): PlaceToTrain | undefined {
  if (place) {
    return places.find((p) => p.id === place);
  }
}

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

function generateTrainingIcs(
  { id, address, startDate, endDate }: Omit<PlaceToTrain, 'schedules'>,
  schedule: Schedule
) {
  const dateStart = startDate.replaceAll('-', '');
  const timeStart = schedule.start.replaceAll(':', '');
  const dateEnd = endDate.replaceAll('-', '');
  const timeEnd = schedule.end.replaceAll(':', '');
  const byday = weekDaysAsFreq(schedule.weekDays);
  const weekDaysList = schedule.weekDays.map(getWeekDayName).filter((w) => !!w);
  const weekDays = conjunctionList.format(weekDaysList);
  const description = `Entrenamiento de balonmano los ${weekDays} de ${schedule.start} a ${schedule.end} con el Club Balonmano Vetusta`;
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

export async function GET({ params: { placeId } }: APIContext<{ placeId: string }>) {
  const placeToTrain = findPlace(placeId);

  if (placeToTrain) {
    const { schedules, ...trainingPlace } = placeToTrain;
    trainingPlace.address = `${trainingPlace.place}, ${trainingPlace.address}`;

    const ics = schedules
      .map((schedule) => generateTrainingIcs(trainingPlace, schedule))
      .join('\n\n');

    if (ics) {
      return new Response(ics, {
        headers: {
          'Content-Description': 'File Transfer',
          'Content-Type': 'application/octet-stream',
          'Content-Disposition': `attachment; filename=entrenamientos-${placeToTrain.place.replaceAll(/[\s\.\(\)]/g, '')}.ics`,
        },
      });
    }
  }

  return new Response('', {
    status: 204,
  });
}

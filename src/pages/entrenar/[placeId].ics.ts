import type { APIContext } from 'astro';
import places from '../../assets/data/training-schedules.json';
import { getWeekDayName } from '../../components/TrainingPlace/get-week-day-name';

function findPlace(place?: string) {
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

function generateTrainingIcs({
  id,
  address,
  schedule,
}: {
  id: string;
  address: string;
  schedule: { start: string; end: string; weekDays: number[] };
}) {
  const byday = weekDaysAsFreq(schedule.weekDays);
  const weekDaysList = schedule.weekDays.map(getWeekDayName).filter((w) => !!w);
  const weekDays = conjunctionList.format(weekDaysList);
  const description = `Entrenamiento de balonmano los ${weekDays} de ${schedule.start} a ${schedule.end} con el Club Balonmano Vetusta`;
  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Club Balonmano Vetusta//NONSGML v1.0//EN
BEGIN:VEVENT
UID:event-training-${id}@balonmanovetusta.com
DTSTAMP:20240923T120000Z
DTSTART;TZID=Europe/Madrid:20240923T${schedule.start.replaceAll(':', '')}00
DTEND;TZID=Europe/Madrid:20240923T${schedule.end.replaceAll(':', '')}00
RRULE:FREQ=WEEKLY;BYDAY=${byday}
SUMMARY:Entrenamiento de Balonmano
LOCATION:${address}
DESCRIPTION:${description}
BEGIN:VALARM
ACTION:DISPLAY
DESCRIPTION:Recordatorio: Entrenamiento de balonmano
TRIGGER:-PT30M
END:VALARM
END:VEVENT
END:VCALENDAR`;
}

export async function GET({ params: { placeId } }: APIContext<{ placeId: string }>) {
  const placeToTrain = findPlace(placeId);

  if (placeToTrain) {
    const { id, schedules, address: addr, place } = placeToTrain;
    const address = `${place}, ${addr}`;

    const ics = generateTrainingIcs({
      id,
      address,
      schedule: schedules[0],
    });

    if (ics) {
      // header('Content-Disposition: attachment; filename='.$quoted);
      // header('Content-Transfer-Encoding: binary');
      // header('Connection: Keep-Alive');
      return new Response(ics, {
        headers: {
          'Content-Description': 'File Transfer',
          'Content-Type': 'application/octet-stream',
          'Content-Disposition': `attachment; filename=entrenamientos-${placeToTrain.place.replaceAll(/[\s\.]/g, '')}.ics`,
        },
      });
    }
  }

  return new Response('', {
    status: 204,
  });
}

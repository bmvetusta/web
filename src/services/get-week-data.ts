import { PRIMERA_GROUP_ID, PRIMERA_TEAM_ID } from 'astro:env/server';
import { rfebmAPIGetCalendar } from './rfebm-api/get-calendar';

export async function getWeekData(week?: number | string | null) {
  if (!week) {
    return;
  }

  const weekNumber = +week;
  if (Number.isNaN(weekNumber) || !Number.isFinite(weekNumber) || weekNumber < 1) {
    return;
  }

  const data = await rfebmAPIGetCalendar(PRIMERA_GROUP_ID);

  const match = data?.find(
    (m) =>
      (m.week === weekNumber && m.localTeam.id === PRIMERA_TEAM_ID) ||
      (m.week === weekNumber && m.visitorTeam.id === PRIMERA_TEAM_ID)
  );

  return match ?? null;
}

import { PRIMERA_GROUP_ID, PRIMERA_TEAM_ID } from 'astro:env/server';
import { rfebmGetCalendar } from './rfebm/get-calendar';

export async function getWeekData(week?: number | string | null) {
  if (!week) {
    return;
  }

  const weekNumber = +week;
  if (Number.isNaN(weekNumber) || !Number.isFinite(weekNumber) || weekNumber < 1) {
    return;
  }

  const data = await rfebmGetCalendar(PRIMERA_GROUP_ID);
  if (!data) {
    return;
  }

  const match = data.find(
    (m) =>
      m.week === weekNumber &&
      (m.localTeam.id === PRIMERA_TEAM_ID || m.visitorTeam.id === PRIMERA_TEAM_ID)
  );
  if (!match) {
    return;
  }

  return match;
}

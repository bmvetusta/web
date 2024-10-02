import { PRIMERA_TEAM_ID } from 'astro:env/server';
import { rfebmAPIGetTeam } from './rfebm-api/get-team';

export async function getWeekData(week?: number | string | null) {
  if (!week) {
    return;
  }

  const weekNumber = +week;
  if (Number.isNaN(weekNumber) || !Number.isFinite(weekNumber) || weekNumber < 1) {
    return;
  }

  const data = await rfebmAPIGetTeam(PRIMERA_TEAM_ID, 2425, 1);
  console.log({ data });
  if (!data) {
    return;
  }

  const match = data.matches.find(
    (m) =>
      m.week === weekNumber &&
      (m.localTeam.id === PRIMERA_TEAM_ID || m.visitorTeam.id === PRIMERA_TEAM_ID)
  );
  if (!match) {
    return;
  }

  return match;
}

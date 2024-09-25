import { getCurrentSeasonId } from './rfebm/get-current-season-id';
import { rfebmGetTeam } from './rfebm/get-team';

export async function getTeamCurrentOrNextMatch(
  teamId: string | number,
  seasonId: string | number = getCurrentSeasonId()
) {
  let match;

  const today = new Date();
  const [dayString, monthString, yearString] = today
    .toLocaleTimeString('es-ES', {
      timeZone: 'Europe/Madrid',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: 'numeric',
    })
    .split(/[,\/]/);

  const currentDateString = `${yearString}-${monthString}-${dayString}`;

  // Get data
  const teamData = await rfebmGetTeam(teamId, seasonId);
  if (teamData && teamData.trayectoria && Array.isArray(teamData.trayectoria)) {
    match =
      teamData.trayectoria.find(
        (m: any) => m?.estado_partido === 'En progreso' || m.fecha.startsWith(currentDateString)
      ) ??
      teamData.trayectoria.find(
        (m: any) => m.fecha.trim().lenght > 0 && m.estado_partido === 'Pendiente'
      );
  }

  return match;
}

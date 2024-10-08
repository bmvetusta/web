import { responseTeamSchema } from 'src/schema/team/response';
import { rfebmApiFetch } from './core';
import { getCurrentSeasonId } from './lib/get-current-season-id';

export async function rfebmAPIGetTeam(
  teamId?: string | number,
  seasonId: string | number = getCurrentSeasonId(),
  ambitoId: string | number = 1
) {
  if (!teamId) {
    return null;
  }

  const pathname = '/ws/equipo';
  const body = new URLSearchParams();
  body.append('id_equipo', teamId.toString());
  body.append('id_temporada', seasonId.toString());
  body.append('id_ambito', ambitoId.toString());

  return rfebmApiFetch(
    pathname,
    responseTeamSchema,
    body
    // , 43200, true
  );
}

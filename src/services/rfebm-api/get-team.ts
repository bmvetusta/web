import { responseTeamSchema } from 'src/schema/team/response';
import { getCurrentSeasonId } from './get-current-season-id';
import { rfebmAPIFetch } from './rfebm-fetch';

export async function rfebmAPIGetTeam(
  teamId: string | number,
  seasonId: string | number = getCurrentSeasonId(),
  ambitoId: string | number = 1
) {
  const pathname = '/ws/equipo';
  const body = new URLSearchParams();
  body.append('id_ambito', ambitoId.toString());
  body.append('id_equipo', teamId.toString());
  body.append('id_temporada', seasonId.toString());

  const data = rfebmAPIFetch(pathname, responseTeamSchema);

  return data;
}

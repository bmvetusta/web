import { RFEBM_API_BASE_HREF } from 'astro:env/server';
import { getRFEBMHeaders } from './base-href';
import { getCurrentSeasonId } from './get-current-season-id';

export async function rfebmGetTeam(
  teamId: string | number,
  seasonId: string | number = getCurrentSeasonId(),
  ambitoId: string | number = 1
) {
  const basepath = '/ws/equipo';
  const url = new URL(basepath, RFEBM_API_BASE_HREF);
  url.searchParams.append('id_ambito', ambitoId.toString());
  url.searchParams.append('id_equipo', teamId.toString());
  url.searchParams.append('id_temporada', seasonId.toString());

  const data = await fetch(url, {
    method: 'POST',
    headers: getRFEBMHeaders(),
  }).then((res) => res.json());

  return data;
}

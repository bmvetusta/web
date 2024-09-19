import { RFEBM_API_BASE_HREF } from 'astro:env/server';
import { getRFEBMHeaders } from './base-href';

export async function rfebmGetTeam(teamId: string | number, seasonId: string | number) {
  const basepath = '/ws/equipo';
  const url = new URL(basepath, RFEBM_API_BASE_HREF);
  url.searchParams.append('id_ambito', '1');
  url.searchParams.append('id_equipo', teamId.toString());
  url.searchParams.append('id_temporada', seasonId.toString());

  const data = await fetch(url, {
    method: 'POST',
    headers: getRFEBMHeaders(),
  }).then((res) => res.json());

  return data;
}

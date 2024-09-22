import { RFEBM_API_BASE_HREF } from 'astro:env/server';
import { getRFEBMHeaders } from './base-href';

export async function rfebmGetOfficialReport(playerId: string | number) {
  const basepath = '/ws/jugador';
  const url = new URL(basepath, RFEBM_API_BASE_HREF);
  const body = new URLSearchParams();
  body.append('id_jugador', playerId.toString());

  const data = await fetch(url, {
    method: 'POST',
    headers: getRFEBMHeaders(),
    body,
  }).then((res) => res.json());

  return data;
}

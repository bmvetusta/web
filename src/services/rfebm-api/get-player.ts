import { RFEBM_API_BASE_HREF } from 'astro:env/server';
import { getRFEBMAPIHeaders } from './base-href';

export async function rfebmAPIGetOfficialReport(playerId?: string | number) {
  if (!playerId) {
    return null;
  }

  const basepath = '/ws/jugador';
  const url = new URL(basepath, RFEBM_API_BASE_HREF);
  const body = new URLSearchParams();
  body.append('id_jugador', playerId.toString());

  const data = await fetch(url, {
    method: 'POST',
    headers: getRFEBMAPIHeaders(),
    body,
  }).then((res) => res.json());

  return data;
}

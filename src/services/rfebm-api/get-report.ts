import { RFEBM_API_BASE_HREF } from 'astro:env/server';
import { getRFEBMAPIHeaders } from './base-href';

export async function rfebmAPIGetOfficialReport(
  groupId?: string | number,
  matchId?: string | number
) {
  if (!groupId || !matchId) {
    return null;
  }

  const basepath = '/ws/acta';
  const url = new URL(basepath, RFEBM_API_BASE_HREF);
  const body = new URLSearchParams();
  body.append('id_grupo', groupId.toString());
  body.append('id_partido', matchId.toString());

  const data = await fetch(url, {
    method: 'POST',
    headers: getRFEBMAPIHeaders(),
    body,
  }).then((res) => res.json());

  return data;
}

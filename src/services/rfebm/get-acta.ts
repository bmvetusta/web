import { RFEBM_API_BASE_HREF } from 'astro:env/server';
import { getRFEBMHeaders } from './base-href';

export async function rfebmGetOfficialReport(groupId: string | number, matchId: string | number) {
  const basepath = '/ws/previo';
  const url = new URL(basepath, RFEBM_API_BASE_HREF);
  const body = new URLSearchParams();
  body.append('id_grupo', groupId.toString());
  body.append('id_partido', matchId.toString());

  const data = await fetch(url, {
    method: 'POST',
    headers: getRFEBMHeaders(),
  }).then((res) => res.text());

  return data;
}

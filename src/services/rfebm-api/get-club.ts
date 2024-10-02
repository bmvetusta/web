import { RFEBM_API_BASE_HREF } from 'astro:env/server';
import { getRFEBMAPIHeaders } from './base-href';

export async function rfebmAPIGetTeam(clubId: string | number, ambitoId: string | number = 13) {
  const basepath = '/ws/infoClub';
  const url = new URL(basepath, RFEBM_API_BASE_HREF);
  url.searchParams.append('idClub', clubId.toString());
  url.searchParams.append('id_ambito', ambitoId.toString());

  const data = await fetch(url, {
    method: 'POST',
    headers: getRFEBMAPIHeaders(),
  }).then((res) => res.json());

  return data;
}

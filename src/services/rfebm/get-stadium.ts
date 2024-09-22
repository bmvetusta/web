import { RFEBM_API_BASE_HREF } from 'astro:env/server';
import { getRFEBMHeaders } from './base-href';

export async function rfebmGetOfficialReport(stadiumId: string | number) {
  const basepath = '/ws/estadio';
  const url = new URL(basepath, RFEBM_API_BASE_HREF);
  const body = new URLSearchParams();
  body.append('id_estadio', stadiumId.toString());

  const data = await fetch(url, {
    method: 'POST',
    headers: getRFEBMHeaders(),
    body,
  }).then((res) => res.json());

  return data;
}

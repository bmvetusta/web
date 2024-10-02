import { RFEBM_API_BASE_HREF } from 'astro:env/server';
import { getRFEBMAPIHeaders } from './base-href';

export async function rfebmAPIGetInitialData() {
  const basepath = '/ws/datosIniciales';
  const url = new URL(basepath, RFEBM_API_BASE_HREF);
  url.searchParams.append('id_ambito', '1');

  const data = await fetch(url, {
    method: 'POST',
    headers: getRFEBMAPIHeaders(),
  }).then((res) => res.json());

  return data;
}

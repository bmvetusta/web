import { RFEBM_API_BASE_HREF } from 'astro:env/server';
import { previousSchema } from '../../schema/previous';
import { getRFEBMHeaders } from './base-href';

export async function rfebmGetPreviewData(matchId: string | number) {
  const basepath = '/ws/previo';
  const url = new URL(basepath, RFEBM_API_BASE_HREF);
  const body = new URLSearchParams();
  body.append('id_partido', matchId.toString());

  const responseData = await fetch(url, {
    method: 'POST',
    headers: getRFEBMHeaders(),
  }).then((res) => res.text());

  const parsedData = previousSchema.safeParse(responseData);

  if (parsedData.success) {
    return parsedData.data;
  }

  return null;
}

import { RFEBM_API_BASE_HREF } from 'astro:env/server';
import { previousSchema } from '../../schema/previous';
import { getRFEBMHeaders } from './base-href';

export async function rfebmGetPreviousData(matchId: string | number) {
  const basepath = '/ws/previo';
  const url = new URL(basepath, RFEBM_API_BASE_HREF);
  const body = new URLSearchParams();
  body.append('id_partido', matchId.toString());

  const responseData = await fetch(url, {
    method: 'POST',
    headers: getRFEBMHeaders(),
    body,
  }).then((res) => res.json());

  const parsedData = previousSchema.safeParse(responseData?.previo);

  if (parsedData.success) {
    return parsedData.data;
  }

  console.error(parsedData.error);

  return null;
}

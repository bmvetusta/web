import { RFEBM_API_BASE_HREF } from 'astro:env/server';
import { previousSchema } from '../../schema/previous';
import { getRFEBMAPIHeaders } from './base-href';

export async function rfebmAPIGetPreviousData(matchId: string | number) {
  const basepath = '/ws/previo';
  const url = new URL(basepath, RFEBM_API_BASE_HREF);
  const body = new URLSearchParams();
  body.append('id_partido', matchId.toString());

  const responseData = await fetch(url, {
    method: 'POST',
    headers: getRFEBMAPIHeaders(),
    body,
  }).then((res) => res.json());

  console.log('Previous', { responseData });

  const parsedData = previousSchema.safeParse(responseData?.previo);

  if (parsedData.success) {
    return parsedData.data;
  }

  console.error(parsedData.error);

  return null;
}

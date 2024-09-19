import { weekSchema } from '../../schema/week';
import { getRFEBMHeaders } from './base-href';

export async function rfebmGetWeeks(groupId: string | number) {
  const basepath = '/ws/jornadas';
  const url = new URL(basepath, 'https://balonmano.isquad.es');
  const body = new URLSearchParams();
  body.append('id_grupo', groupId.toString());

  const responseData = await fetch(url, {
    method: 'POST',
    headers: getRFEBMHeaders(),
    body,
  }).then((res) => res.json());

  const parsedData = weekSchema.safeParse(responseData);

  if (parsedData.success) {
    return parsedData.data;
  }

  return null;
}

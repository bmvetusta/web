import { RFEBM_API_BASE_HREF } from 'astro:env/server';
import { calendarSchema } from '../../schema/calendar';
import { getRFEBMHeaders } from './base-href';

export async function rfebmGetCalendar(groupId: string | number) {
  const basepath = '/ws/calendario';
  const url = new URL(basepath, RFEBM_API_BASE_HREF);
  const body = new URLSearchParams();
  body.append('id_grupo', groupId.toString());

  const responseData = await fetch(url, {
    method: 'POST',
    headers: getRFEBMHeaders(),
    body,
  }).then((res) => res.json());

  const parsedData = calendarSchema.safeParse(responseData);

  if (parsedData.success) {
    return parsedData.data.calendarios;
  }

  return null;
}

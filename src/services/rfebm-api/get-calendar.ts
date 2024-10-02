import type { z } from 'astro:schema';
import { calendarResponseSchema } from '../../schema/calendar/response';
import { rfebmAPIFetch } from './rfebm-fetch';

export async function rfebmAPIGetCalendar(
  groupId: string | number
): Promise<z.output<typeof calendarResponseSchema> | null> {
  const pathname = '/ws/calendario';
  const body = new URLSearchParams();
  body.append('id_grupo', groupId.toString());

  return rfebmAPIFetch(pathname, calendarResponseSchema, body, 7200, true);
}

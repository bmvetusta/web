import type { z } from 'astro:schema';
import { responseCalendarSchema } from '../../schema/calendar/response';
import { rfebmAPIFetch } from './rfebm-fetch';

export async function rfebmAPIGetCalendar(
  groupId?: string | number
): Promise<z.output<typeof responseCalendarSchema> | null> {
  if (!groupId) {
    return null;
  }

  const pathname = '/ws/calendario';
  const body = new URLSearchParams();
  body.append('id_grupo', groupId.toString());

  return rfebmAPIFetch<typeof responseCalendarSchema>(
    pathname,
    responseCalendarSchema,
    body,
    86400,
    true
  );
}

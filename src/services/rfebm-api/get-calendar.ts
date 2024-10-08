import { responseCalendarSchema } from '@schemas/calendar/response';
import { rfebmApiFetch } from './core';

export async function rfebmApiGetCalendar(groupId?: string | number) {
  if (!groupId) {
    return null;
  }

  const pathname = '/ws/calendario';
  const body = new URLSearchParams();
  body.append('id_grupo', groupId.toString());

  // console.log('Fetching the calendar for the group', { groupId });
  return rfebmApiFetch(pathname, responseCalendarSchema, body, 86400, true);
}

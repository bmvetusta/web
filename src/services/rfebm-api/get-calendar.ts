import { responseCalendarSchema } from '../../schema/calendar/response';
import { rfebmAPIFetch } from './rfebm-fetch';

export async function rfebmAPIGetCalendar(groupId?: string | number) {
  if (!groupId) {
    return null;
  }

  const pathname = '/ws/calendario';
  const body = new URLSearchParams();
  body.append('id_grupo', groupId.toString());

  console.log('Fetching the calendar for the group', { groupId });
  return rfebmAPIFetch(
    pathname,
    responseCalendarSchema,
    body
    // ,86400,
    // true
  );
}

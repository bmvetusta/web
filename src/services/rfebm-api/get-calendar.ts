import { responseCalendarSchema } from '@schemas/calendar/response';
import { rfebmApiFetch } from './core';
import { HOUR_IN_SECS } from './lib/secs';

export async function rfebmApiGetCalendar(
  groupId?: string | number,
  cacheTTL = HOUR_IN_SECS,
  cacheAsFallback = true,
  forceRevalidate = false,
  forceCachedDataIfTruthy = false
) {
  if (!groupId) {
    return null;
  }

  const pathname = '/ws/calendario';
  const body = new URLSearchParams();
  body.append('id_grupo', groupId.toString());

  // console.log('Fetching the calendar for the group', { groupId });
  return rfebmApiFetch(
    pathname,
    responseCalendarSchema,
    body,
    cacheTTL,
    cacheAsFallback,
    forceRevalidate,
    forceCachedDataIfTruthy
  );
}

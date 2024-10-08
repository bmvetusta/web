import { responseWeeksSchema } from '../../schema/weeks/response';
import { rfebmApiFetch } from './core';
import { HOUR_IN_SECS } from './lib/secs';

export async function rfebmAPIGetWeeks(
  groupId?: string | number,
  cacheTTL = HOUR_IN_SECS,
  cacheAsFallback = true
) {
  if (!groupId) {
    return null;
  }

  const pathname = '/ws/jornadas';
  const body = new URLSearchParams();
  body.append('id_grupo', groupId.toString());

  const responseData = rfebmApiFetch(
    pathname,
    responseWeeksSchema,
    body,
    cacheTTL,
    cacheAsFallback
  );

  return responseData;
}

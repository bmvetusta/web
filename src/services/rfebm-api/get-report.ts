import { z } from 'zod';
import { rfebmApiFetch } from './core';
import { MINUTE_IN_SECS } from './lib/secs';

export async function rfebmAPIGetOfficialReport(
  groupId?: string | number,
  matchId?: string | number,
  cacheTTL = MINUTE_IN_SECS,
  cacheAsFallback = true
) {
  if (!groupId || !matchId) {
    return null;
  }

  const pathname = '/ws/acta';
  const body = new URLSearchParams();
  body.append('id_grupo', groupId.toString());
  body.append('id_partido', matchId.toString());

  return rfebmApiFetch(pathname, z.any(), body, cacheTTL, cacheAsFallback); // TODO: Define schema for this endpoint
}

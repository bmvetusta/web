import { z } from 'zod';
import { rfebmApiFetch } from './core';
import { DAY_IN_SECS } from './lib/secs';

export async function rfebmAPIGetPlayer(
  playerId?: string | number,
  cacheTTL = DAY_IN_SECS,
  cacheAsFallback = true,
  forceRevalidate = false,
  forceCachedDataIfTruthy = false
) {
  if (!playerId) {
    return null;
  }

  const pathname = '/ws/jugador';
  const body = new URLSearchParams();
  body.append('id_jugador', playerId.toString());

  return rfebmApiFetch(
    pathname,
    z.any(),
    body,
    cacheTTL,
    cacheAsFallback,
    forceRevalidate,
    forceCachedDataIfTruthy
  ); // TODO: Define schema for this request
}

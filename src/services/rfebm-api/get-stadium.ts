import { z } from 'zod';
import { rfebmApiFetch } from './core';
import { DAY_IN_SECS } from './lib/secs';

export async function rfebmAPIGetOfficialReport(
  stadiumId?: string | number,
  cacheTTL = DAY_IN_SECS,
  cacheAsFallback = true
) {
  if (!stadiumId) {
    return null;
  }

  const pathname = '/ws/estadio';
  const body = new URLSearchParams();
  body.append('id_estadio', stadiumId.toString());

  return rfebmApiFetch(pathname, z.any(), body, cacheTTL, cacheAsFallback); // TODO: Define schema for this request
}

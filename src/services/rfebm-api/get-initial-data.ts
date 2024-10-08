import { z } from 'zod';
import { rfebmApiFetch } from './core';
import { WEEK_IN_SECS } from './lib/secs';

export async function rfebmAPIGetInitialData(cacheTTL = WEEK_IN_SECS, cacheAsFallback = true) {
  const pathname = '/ws/datosIniciales';
  const body = new URLSearchParams();
  body.append('id_ambito', '1');

  return rfebmApiFetch(pathname, z.any(), body, cacheTTL, cacheAsFallback); // TODO: Define schema for this request
}

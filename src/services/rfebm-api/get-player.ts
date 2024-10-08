import { z } from 'zod';
import { rfebmApiFetch } from './core';

export async function rfebmAPIGetOfficialReport(playerId?: string | number) {
  if (!playerId) {
    return null;
  }

  const pathname = '/ws/jugador';
  const body = new URLSearchParams();
  body.append('id_jugador', playerId.toString());

  return rfebmApiFetch(pathname, z.any(), body); // TODO: Define schema for this request
}

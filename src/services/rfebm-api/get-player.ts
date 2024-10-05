import { z } from 'zod';
import { rfebmAPIFetch } from './rfebm-fetch';

export async function rfebmAPIGetOfficialReport(playerId?: string | number) {
  if (!playerId) {
    return null;
  }

  const pathname = '/ws/jugador';
  const body = new URLSearchParams();
  body.append('id_jugador', playerId.toString());

  return rfebmAPIFetch(pathname, z.any(), body); // TODO: Define schema for this request
}

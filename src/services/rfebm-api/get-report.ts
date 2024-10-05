import { z } from 'zod';
import { rfebmAPIFetch } from './rfebm-fetch';

export async function rfebmAPIGetOfficialReport(
  groupId?: string | number,
  matchId?: string | number
) {
  if (!groupId || !matchId) {
    return null;
  }

  const pathname = '/ws/acta';
  const body = new URLSearchParams();
  body.append('id_grupo', groupId.toString());
  body.append('id_partido', matchId.toString());

  return rfebmAPIFetch(pathname, z.any(), body); // TODO: Define schema for this endpoint
}

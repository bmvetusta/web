import { z } from 'zod';
import { rfebmAPIFetch } from './rfebm-fetch';

export async function rfebmAPIGetClub(clubId: string | number, ambitoId: string | number = 13) {
  if (!clubId) {
    return null;
  }

  const pathname = '/ws/infoClub';
  const body = new URLSearchParams();
  body.append('idClub', clubId.toString());
  body.append('id_ambito', ambitoId.toString());

  return rfebmAPIFetch(pathname, z.any(), body); // TODO: Create a schema for the response
}

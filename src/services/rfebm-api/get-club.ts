import { z } from 'zod';
import { rfebmApiFetch } from './core';

export async function rfebmApiGetClub(clubId: string | number, ambitoId: string | number = 13) {
  if (!clubId) {
    return null;
  }

  const pathname = '/ws/infoClub';
  const body = new URLSearchParams();
  body.append('idClub', clubId.toString());
  body.append('id_ambito', ambitoId.toString());

  return rfebmApiFetch(pathname, z.any(), body); // TODO: Create a schema for the response
}

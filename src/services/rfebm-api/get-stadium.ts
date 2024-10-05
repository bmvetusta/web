import { z } from 'zod';
import { rfebmAPIFetch } from './rfebm-fetch';

export async function rfebmAPIGetOfficialReport(stadiumId?: string | number) {
  if (!stadiumId) {
    return null;
  }

  const pathname = '/ws/estadio';
  const body = new URLSearchParams();
  body.append('id_estadio', stadiumId.toString());

  return rfebmAPIFetch(pathname, z.any(), body); // TODO: Define schema for this request
}

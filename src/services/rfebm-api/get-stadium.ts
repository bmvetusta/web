import { z } from 'zod';
import { rfebmApiFetch } from './core';

export async function rfebmAPIGetOfficialReport(stadiumId?: string | number) {
  if (!stadiumId) {
    return null;
  }

  const pathname = '/ws/estadio';
  const body = new URLSearchParams();
  body.append('id_estadio', stadiumId.toString());

  return rfebmApiFetch(pathname, z.any(), body); // TODO: Define schema for this request
}

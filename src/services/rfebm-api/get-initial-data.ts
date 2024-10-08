import { z } from 'zod';
import { rfebmApiFetch } from './core';

export async function rfebmAPIGetInitialData() {
  const pathname = '/ws/datosIniciales';
  const body = new URLSearchParams();
  body.append('id_ambito', '1');

  return rfebmApiFetch(pathname, z.any(), body); // TODO: Define schema for this request
}

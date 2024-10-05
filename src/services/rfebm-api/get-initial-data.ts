import { z } from 'zod';
import { rfebmAPIFetch } from './rfebm-fetch';

export async function rfebmAPIGetInitialData() {
  const pathname = '/ws/datosIniciales';
  const body = new URLSearchParams();
  body.append('id_ambito', '1');

  return rfebmAPIFetch(pathname, z.any(), body); // TODO: Define schema for this request
}

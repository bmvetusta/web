import { RFEBM_USER_AGENT } from 'astro:env/server';

export function getRFEBMAPIHeaders() {
  const headers = new Headers({
    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    'Connection': 'keep-alive',
    'Accept': 'application/json',
    'User-Agent': RFEBM_USER_AGENT,
    'Accept-Language': 'es-ES;q=1.0, en-ES;q=0.9',
  });

  return headers;
}

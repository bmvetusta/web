import { FETCH_TIMEOUT } from 'astro:env/server';
import { ZodError, type z } from 'zod';
import { getRFEBMAPIHeaders } from '../base-href';

export const fetchSignal = new AbortController();

export async function getDataByFetch<T extends z.ZodType = z.ZodType>(
  url: URL,
  schema: T,
  body?: URLSearchParams
): Promise<T | null> {
  const init: RequestInit = {
    method: 'POST',
    body,
    headers: getRFEBMAPIHeaders(),
    signal: fetchSignal.signal,
  };

  const timeoutId = setTimeout(() => fetchSignal.abort(), FETCH_TIMEOUT);

  // console.debug('Fetching the data', { init });
  return fetch(url, init)
    .then((res) => res.json())
    .then(async (response: any) => {
      console.debug('Fetching response', { status: response?.status });

      if (response.status === 'OK') {
        const data = schema.safeParse(response);

        if (data.success && data.data) {
          console.debug('Data fetched & parsed correctly');
          return data.data as T;
        }

        if (data.success === false) {
          if (data.error instanceof ZodError) {
            console.error(`Error while parsing the fetched data from url "${url.href}"`);
            // throw data.error;
          }
        }
      }

      if (response.status !== 'OK') {
        // If any error while requesting data we emit an error to allow
        // some automations in case any header has expired because they
        // change User-Agent sometimes due is used as a password
        // fetchEmitter.emit(fetchEventError, {
        //   url,
        //   requestInit: init,
        //   response: responseData,
        // });
        console.error(
          'Fetching the data from RFEBM website failed. Perhaps a User Agent change :)'
        );

        // throw new Error('Fetching the data from RFEBM website failed');
      }

      console.error(`Unknown error while fetching "${url.href}"`);
      // throw new Error(`Unknown error while fetching "${url.href}"`);
      return null;
    })
    .catch(() => null)
    .finally(() => {
      clearTimeout(timeoutId);
    });
}

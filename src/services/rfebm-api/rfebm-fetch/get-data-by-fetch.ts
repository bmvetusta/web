import { FETCH_TIMEOUT, PROXY_PASSWORD, PROXY_URL, PROXY_USER } from 'astro:env/server';
import { HttpsProxyAgent } from 'https-proxy-agent';
import fetch from 'node-fetch';
import { ZodError, type z } from 'zod';
import { getRFEBMAPIHeaders } from '../base-href';

let agent: any | undefined;

if (PROXY_URL) {
  agent = new HttpsProxyAgent(PROXY_URL);
}

export const fetchSignal = new AbortController();

export async function getDataByFetch<T extends z.ZodType = z.ZodType>(
  url: URL,
  schema: T,
  body?: URLSearchParams
): Promise<T | null> {
  const init: any = {
    method: 'POST',
    body,
    headers: getRFEBMAPIHeaders(),
    signal: AbortSignal.timeout(FETCH_TIMEOUT),
    // signal: fetchSignal.signal,
  };

  if (agent) {
    init.agent = agent;

    if (PROXY_USER) {
      init.auth = {
        username: PROXY_USER,
        password: PROXY_PASSWORD ?? undefined,
      };
    }
  }

  console.time('Fetching the data');

  // const timeoutId = setTimeout(() => fetchSignal.abort(), FETCH_TIMEOUT);

  console.log('Fetching the data', { init });
  return fetch(url, init)
    .then(async (res) => {
      const text = await res.text().catch(() => {
        console.error('Error while converting to text the response');
        return null;
      });
      console.log('Fetching response', {
        status: text,
      });
      console.timeLog('Fetching the data');

      const response = JSON.parse(text || 'null');

      if (response.status === 'OK') {
        const data = schema.safeParse(response);

        if (data.success && data.data) {
          console.log('Data fetched & parsed correctly', {
            data: JSON.stringify(Object.keys(data.data)),
          });
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
      console.log('Fetching the data finished');
      console.timeEnd('Fetching the data');
    });
  // .finally(() => {
  //   clearTimeout(timeoutId);
  // });
}

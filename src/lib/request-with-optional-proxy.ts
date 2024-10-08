import { Agent } from 'agent-base';
import { type RequestOptions, request } from 'https';
import type { InputSchemaType } from 'types';
import { z } from 'zod';

async function proxyAgentByURL(inputUrl: string | URL): Promise<Agent | undefined> {
  const url = new URL(inputUrl.toString());

  if (url.protocol === 'https:') {
    // console.debug('Using HttpsProxyAgent');
    return import('https-proxy-agent').then(({ HttpsProxyAgent }) => new HttpsProxyAgent(url.href));
  }

  if (url.protocol === 'http:') {
    // console.debug('Using HttpProxyAgent');
    return import('http-proxy-agent').then(({ HttpProxyAgent }) => new HttpProxyAgent(url.href));
  }

  if (url.protocol.startsWith('socks')) {
    // console.debug('Using SocksProxyAgent');
    return import('socks-proxy-agent').then(({ SocksProxyAgent }) => new SocksProxyAgent(url));
  }

  if (url.protocol.startsWith('pac')) {
    // console.debug('Using PacProxyAgent');
    return import('pac-proxy-agent').then(({ PacProxyAgent }) => new PacProxyAgent(url));
  }

  console.error('Unknown protocol', url.protocol);
  return undefined;
}

export async function requestWithOptionalProxy<T extends InputSchemaType>(
  url: string | URL,
  schema: T = z.any() as unknown as T,
  proxyUrl?: string | URL,
  options: RequestOptions = {},
  body?: BodyInit
): Promise<z.output<T> | null> {
  if (proxyUrl) {
    const agent = await proxyAgentByURL(proxyUrl);
    options.agent = agent;

    // console.log({ agent });
  }

  return new Promise((resolve, reject) => {
    const req = request(url, options, (res) => {
      if (proxyUrl && !(options.agent instanceof Agent)) {
        // console.error('Error: retrieving the proxy Agent', options.agent instanceof Agent);
        reject('Error: retrieving the proxy Agent "%s"');
      }

      let data: string = '';
      res.on('data', (chunk) => {
        data += chunk?.toString();
      });

      res.on('end', () => {
        const parsedData = schema.safeParse(JSON.parse(data));
        if (parsedData.success && parsedData.data) {
          resolve(parsedData.data as z.output<T>);
        } else {
          reject(parsedData.error?.errors);
        }
      });
    }).on('error', (err) => {
      reject(err);
    });

    if (body) {
      req.write(body.toString());
    }

    req.end();
  });
}

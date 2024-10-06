import { requestWithOptionalProxy } from 'src/lib/request-with-optional-proxy';
import { type z } from 'zod';
import { getRFEBMAPIHeaders } from '../get-fetch-headers';

export async function requestRFEBMAPIData<T extends z.ZodType = z.ZodType>(
  url: URL,
  schema: T,
  body?: URLSearchParams
): Promise<z.output<T> | null> {
  const headers = getRFEBMAPIHeaders();

  return requestWithOptionalProxy(
    url,
    schema,
    process.env.PROXY_URL,
    {
      headers,
      method: 'POST',
    },
    body
  ).catch((e) => {
    console.error('Error while fetching the data', e);
    return null;
  });
}

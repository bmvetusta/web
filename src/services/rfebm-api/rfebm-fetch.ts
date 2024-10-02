import { RFEBM_API_BASE_HREF } from 'astro:env/server';
import EventEmitter from 'node:events';
import { z } from 'zod';
import { getRFEBMAPIHeaders } from './base-href';

export const fetchEmitter = new EventEmitter();
export const fetchEventError = 'error:fetch:rfebm';

// const RFEBM_API_BASE_HREF = 'https://balonmano.isquad.es';
export async function rfebmAPIFetch<T extends z.ZodType = z.ZodType>(
  pathname: string,
  schema: T,
  body?: BodyInit,
  shouldReturnUnparsedIfFail = false,
  shouldEmitErrorsIfFetchFail = true,
  shouldPrintErrorsToConsole = false
): Promise<z.output<T> | null> {
  const url = new URL(pathname, RFEBM_API_BASE_HREF);

  try {
    const init = {
      method: 'POST',
      body,
      headers: { ...getRFEBMAPIHeaders() },
    };
    const responseData = await fetch(url, init).then((res) => res.json());

    if (responseData.status === 'OK') {
      const parsedData = schema.safeParse(responseData);

      if (parsedData.success) {
        return parsedData.data;
      }

      if (shouldReturnUnparsedIfFail) {
        return responseData;
      }

      throw new z.ZodError(parsedData.error.errors);
    }

    // If any error while requesting data we emit an error to allow
    // some automations in case any header has expired because they
    // change User-Agent sometimes due is used as a password
    if (responseData.status === 'KO' && shouldEmitErrorsIfFetchFail) {
      fetchEmitter.emit(fetchEventError, {
        url,
        requestInit: init,
        response: responseData,
      });
    }

    if (shouldReturnUnparsedIfFail) {
      return responseData;
    }
  } catch (error) {
    if (shouldPrintErrorsToConsole) {
      console.error(error);
    }
  }

  return null;
}

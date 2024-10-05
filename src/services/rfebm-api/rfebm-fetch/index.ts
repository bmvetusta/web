import type { z } from 'zod';
import { getDataByFetch } from './get-data-by-fetch';

const DEFAULT_RFEBM_API_BASE_HREF = 'https://balonmano.isquad.es';
const RFEBM_API_BASE_HREF = process.env.RFEBM_API_BASE_HREF ?? DEFAULT_RFEBM_API_BASE_HREF;

export async function rfebmAPIFetch<T extends z.ZodType = z.ZodType>(
  pathname: string,
  schema: T,
  body?: URLSearchParams
  // cacheTTL = 86400,
  // cacheAsFallback = false
  // shouldPrintErrorsToConsole = false,
  // shouldEmitErrorsIfFetchFail = true
): Promise<z.output<T> | null> {
  const url = new URL(pathname, RFEBM_API_BASE_HREF);

  return getDataByFetch<T>(url, schema, body);
}

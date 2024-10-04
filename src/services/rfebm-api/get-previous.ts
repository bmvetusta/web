import { responsePreviousSchema } from 'src/schema/previous/response';
import { rfebmAPIFetch } from './rfebm-fetch';

export async function rfebmAPIGetPreviousData(matchId?: string | number) {
  if (!matchId) {
    console.error('No matchId for previous data');
    return null;
  }

  const pathname = '/ws/previo';
  const body = new URLSearchParams();
  body.append('id_partido', matchId.toString());

  return rfebmAPIFetch(
    pathname,
    responsePreviousSchema,
    body
    // , 86400, true
  );
}

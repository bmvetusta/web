import { responseWeeksSchema } from '../../schema/weeks/response';
import { rfebmAPIFetch } from './rfebm-fetch';

export async function rfebmAPIGetWeeks(groupId?: string | number) {
  if (!groupId) {
    return null;
  }

  const pathname = '/ws/jornadas';
  const body = new URLSearchParams();
  body.append('id_grupo', groupId.toString());

  const responseData = rfebmAPIFetch(pathname, responseWeeksSchema, body, 86400, true);

  return responseData;
}

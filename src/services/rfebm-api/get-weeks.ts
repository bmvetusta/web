import { responseWeeksSchema } from '../../schema/weeks/response';
import { rfebmAPIFetch } from './rfebm-fetch';

export async function rfebmAPIGetWeeks(groupId: string | number) {
  const pathname = '/ws/jornadas';
  const body = new URLSearchParams();
  body.append('id_grupo', groupId.toString());

  const responseData = rfebmAPIFetch(pathname, responseWeeksSchema, body);

  return responseData;
}

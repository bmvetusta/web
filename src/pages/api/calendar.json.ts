import { PRIMERA_GROUP_ID, PRIMERA_TEAM_ID } from 'astro:env/server';
import { rfebmApiGetCalendar } from 'src/services/rfebm-api/get-calendar';

export const prerender = false;

export async function GET() {
  const matches = await rfebmApiGetCalendar(PRIMERA_GROUP_ID, 86400, true).then((res) =>
    res?.filter((m) => m.localTeam.id === PRIMERA_TEAM_ID || m.visitorTeam.id === PRIMERA_TEAM_ID)
  );

  return new Response(JSON.stringify(matches), {
    headers: {
      'content-type': 'application/json',
    },
  });
}

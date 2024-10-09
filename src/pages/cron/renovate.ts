import type { APIContext } from 'astro';
import { CLUB_AMBITO_ID, CLUB_ID, PRIMERA_GROUP_ID, PRIMERA_TEAM_ID } from 'astro:env/server';
import { sendNotificationPushover } from 'src/services/pushover/send-notification';
import { rfebmApiGetCalendar } from 'src/services/rfebm-api/get-calendar';
import { rfebmApiGetClub } from 'src/services/rfebm-api/get-club';
import { rfebmAPIGetInitialData } from 'src/services/rfebm-api/get-initial-data';
import { rfebmAPIGetTeam } from 'src/services/rfebm-api/get-team';
import { getCurrentSeasonId } from 'src/services/rfebm-api/lib/get-current-season-id';
import { WEEK_IN_SECS } from 'src/services/rfebm-api/lib/secs';

export const prerender = false;

async function fetchIsWorking() {
  return rfebmAPIGetInitialData(0, false)
    .then((res) => res === null)
    .then((res) => res !== null)
    .catch(() => false);
}

export async function GET({ request }: APIContext) {
  if (request.headers.get('authorization') !== process.env.CRON_SECRET) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Next array order is important
  const promises = [
    rfebmApiGetCalendar(PRIMERA_GROUP_ID, 86400, true),
    rfebmAPIGetTeam(PRIMERA_TEAM_ID, getCurrentSeasonId(), 1, 86400, true),
    rfebmApiGetClub(CLUB_ID, CLUB_AMBITO_ID, 86400, true),
    rfebmAPIGetInitialData(WEEK_IN_SECS, true),
    fetchIsWorking(),
  ];

  const revalidateResult = await Promise.allSettled(promises).then((results) => {
    const calendar = results[0].status === 'fulfilled' && results[0].value !== null;
    const team = results[1].status === 'fulfilled' && results[1].value !== null;
    const club = results[2].status === 'fulfilled' && results[2].value !== null;
    const initialData = results[3].status === 'fulfilled' && results[3].value !== null;
    const fetchIsWorking = results[4].status === 'fulfilled' && results[4].value !== null;

    return {
      fetchIsWorking,
      calendar,
      team,
      club,
      initialData,
      ok: calendar && team && club && initialData && fetchIsWorking,
    };
  });

  if (!revalidateResult.ok) {
    const message = `Error revalidando datos:\n${(JSON.stringify(revalidateResult), null, 2)}`;
    const notification = await sendNotificationPushover({ message });
    if (!notification) {
      console.error(message);
      console.error('Error enviando notificación');
    }
  }

  console.debug(revalidateResult);

  return new Response('OK', { status: 200 });
}

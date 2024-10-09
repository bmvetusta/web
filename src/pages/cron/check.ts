import type { APIContext } from 'astro';
import { PROXY_URL, RFEBM_APP_ID, SEND_NOTIFICATION_OK_STATUS } from 'astro:env/server';
import { z } from 'astro:schema';
import { requestWithOptionalProxy } from 'src/lib/request-with-optional-proxy';
import { appVersionAppStore } from 'src/services/app-store/app-version';
import { sendNotificationPushover } from 'src/services/pushover/send-notification';
import { clientUpstash } from 'src/services/upstash/client';

export const prerender = false;

const REDIS_APP_CURRENT_VERSION_KEY = 'rfebm-app-current-version';

const redis = clientUpstash();

async function appHasChangedVersion() {
  const currentVersion = (await redis?.get(REDIS_APP_CURRENT_VERSION_KEY)) ?? null;
  const nextVersion = await appVersionAppStore(RFEBM_APP_ID);

  if (nextVersion !== null) {
    await redis?.set(REDIS_APP_CURRENT_VERSION_KEY, nextVersion);
  }

  // TODO: Notify the change in the app version
  return currentVersion !== null && nextVersion !== null && currentVersion !== nextVersion;
}

async function checkProxy() {
  const schema = z
    .object({ ip: z.string().ip() })
    .transform((data) => data.ip)
    .pipe(z.string().ip());
  if (PROXY_URL) {
    const proxyIp = await requestWithOptionalProxy('https://ifconfig.co/json', schema, PROXY_URL);
    const ip = await requestWithOptionalProxy('https://ifconfig.co/json', schema);
    return proxyIp !== ip;
  }

  return true; // No configured means works as expected
}

export async function GET({ request }: APIContext) {
  if (request.headers.get('authorization') !== process.env.CRON_SECRET) {
    return new Response('Unauthorized', { status: 401 });
  }

  const message = await Promise.allSettled([appHasChangedVersion(), checkProxy()])
    .then(async (results) => {
      let text = '';
      if (results[0].status === 'fulfilled' && results[0].value) {
        text += 'Ha cambiado la versión de la app de RFEBM\n';
      }

      if (results[1].status === 'fulfilled' && !results[1].value) {
        text += 'El proxy NO funciona\n';
      }

      if (text === '' && SEND_NOTIFICATION_OK_STATUS) {
        text = 'El proxy funciona y la app no ha cambiado de versión';
      }

      return text;
    })
    .catch((e) => {
      console.error(e);
      return 'Ocurrió algún error desconocido comprobando el proxy y la versión de la app';
    });

  if (message.length > 0) {
    const notification = await sendNotificationPushover({ message });
    if (!notification) {
      console.log(message);
      console.error('Error sending notification');
    }
  }

  return new Response('OK', { status: 200 });
}

import { PUSHOVER_API_TOKEN, PUSHOVER_USER_KEY } from 'astro:env/server';

const url = 'https://api.pushover.net/1/messages.json';

type PushoverCustomSound = string;
type PushoverSound =
  | 'none'
  | 'vibrate'
  | 'updown'
  | 'echo'
  | 'persistent'
  | 'climb'
  | 'alien'
  | 'tugboat'
  | 'spacealarm'
  | 'siren'
  | 'pianobar'
  | 'mechanical'
  | 'magic'
  | 'intermission'
  | 'incoming'
  | 'gamelan'
  | 'falling'
  | 'cosmic'
  | 'classical'
  | 'cashregister'
  | 'bugle'
  | 'bike'
  | 'pushover';

type SendNotificationPushover = {
  // token?: string;
  // user?: string;
  message: string; // 1024 4-bytes
  attachment?: Buffer;
  attachment_base64?: string;
  attachment_type?: string;
  device?: string;
  html?: 1;
  priority?: -2 | -1 | 0 | 1 | 2;
  sound?: PushoverSound | PushoverCustomSound;
  timestamp?: number;
  title?: string; // 250 characters
  ttl?: number;
  url?: string; // 512 characters
  url_title?: string; // 100 characters
};

// https://play.google.com/store/apps/details?id=<package_name> (Android Play Store)
// itms-apps://itunes.apple.com/app/<app_name>/<app_id> (iOS App)

export async function sendNotificationPushover(props: SendNotificationPushover) {
  if (!PUSHOVER_API_TOKEN || !PUSHOVER_USER_KEY) {
    console.error('PUSHOVER_API_TOKEN or PUSHOVER_USER_KEY is not set');
    return false;
  }

  props.priority ??= 0;
  props.timestamp ??= Math.floor(Date.now() / 1000);

  const body = new URLSearchParams();
  body.append('token', PUSHOVER_API_TOKEN);
  body.append('user', PUSHOVER_USER_KEY);

  for (const [key, value] of Object.entries(props)) {
    body.append(key, value.toString());
  }

  const init: RequestInit = {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  return fetch(url, init)
    .then((res) => res.json())
    .then((data) => data?.status === 1)
    .catch(() => false);
}

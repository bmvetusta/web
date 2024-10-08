import type { APIContext } from 'astro';

export async function GET({ request }: APIContext) {
  if (request.headers.get('authorization') !== process.env.CRON_SECRET) {
    return new Response('Unauthorized', { status: 401 });
  }
}

import type { APIContext } from 'astro';
import { PRIMERA_GROUP_ID } from 'astro:env/server';
import { z } from 'astro:schema';
import { rfebmAPIGetOfficialReport } from 'src/services/rfebm-api/get-report';
import { clientUpstash } from 'src/services/upstash/client';

export const prerender = false;

const paramsSchema = z.object({ matchId: z.coerce.number().min(0) }).transform((p) => p.matchId);

export async function GET({ params }: APIContext<{ matchId: number }>) {
  const matchId = paramsSchema.safeParse(params)?.data;
  const match = matchId ? await rfebmAPIGetOfficialReport(PRIMERA_GROUP_ID, matchId) : null;
  if (!matchId || !match) {
    if (!match) {
      console.error('The official report did not return any data. Match ID:', matchId);
      console.error('Proxy URL:', process.env.PROXY_URL);
      console.error('Check if the API is working correctly with that proxy URL');

      const redis = clientUpstash();
      if (redis) {
        await redis.set(
          'RFEBM_API_FAILED',
          JSON.stringify({
            matchId,
            date: new Date().toISOString(),
            proxyUrl: process.env.PROXY_URL,
          })
        );
      }
    }
    return new Response('Invalid match ID', { status: 400 });
  }

  return new Response(JSON.stringify(match), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=15',
    },
  });
}

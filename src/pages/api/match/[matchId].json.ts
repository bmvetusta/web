import type { APIContext } from 'astro';
import { PRIMERA_GROUP_ID } from 'astro:env/server';
import { z } from 'astro:schema';
import { rfebmAPIGetOfficialReport } from 'src/services/rfebm-api/get-report';

const paramsSchema = z.object({ matchId: z.coerce.number().min(0) }).transform((p) => p.matchId);

export async function GET({ params }: APIContext<{ matchId: number }>) {
  const matchId = paramsSchema.safeParse(params)?.data;
  const match = matchId ? await rfebmAPIGetOfficialReport(PRIMERA_GROUP_ID, matchId) : null;
  if (!matchId) {
    return new Response('Invalid match ID', { status: 400 });
  }
}

import type { APIContext } from 'astro';
import { rfebmAPIGetTeam } from 'src/services/rfebm-api/get-team';

export const prerender = false;

export async function GET({ params: { teamId } }: APIContext<{ teamId: string }>) {
  const teamData = await rfebmAPIGetTeam(teamId);
  return new Response(JSON.stringify(teamData), {
    status: 200,
    headers: {
      'content-type': 'application/json',
    },
  });
}

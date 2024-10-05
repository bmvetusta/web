import { rfebmAPIGetInitialData } from 'src/services/rfebm-api/get-initial-data';

export const prerender = false;

export async function GET() {
  // const teamData = await rfebmAPIGetTeam(teamId);
  // return new Response(JSON.stringify(teamData), {
  //   status: 200,
  //   headers: {
  //     'content-type': 'application/json',
  //   },
  // });

  const data = await rfebmAPIGetInitialData();

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'content-type': 'application/json',
    },
  });
}

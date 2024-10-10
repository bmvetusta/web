import { verifyAccess, type ApiData } from '@vercel/flags';
import type { APIContext } from 'astro';

export const prerender = false;


const featureFlagsDefinition: ApiData = {
  definitions: {
    liveMatch: {
      description: 'Controls if the live match is visible',
      origin: 'https://balonmanovetusta.com/#new-feature',
      options: [
        { value: false, label: 'Off' },
        { value: true, label: 'On' },
      ],
    },

  },
  hints: [
    {
      key: 'liveMatch',
      text: 'This is a hint for the live match feature',
    },
  ],
  overrideEncryptionMode: 'encrypted',
};

export type FeatureFlags = { liveMatch: boolean };
 
export async function GET({request}: APIContext) {
  const access = await verifyAccess(request.headers.get('Authorization'));
  if (!access) {
    return new Response(null, { status: 401 });
  }
 
  return new Response(JSON.stringify(featureFlagsDefinition), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
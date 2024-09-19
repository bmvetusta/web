import type { APIContext } from 'astro';

export async function GET({ site }: APIContext) {
  console.log({ site });

  return new Response('Hola');
}

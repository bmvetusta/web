import { z } from 'zod';

const schema = z
  .object({
    resultCount: z.number(),
    results: z.array(
      z.object({
        version: z.string(),
      })
    ),
  })
  .transform((data) => data.results?.[0]?.version ?? null)
  .pipe(z.string().nullable());

export async function appVersionAppStore(appId: number): Promise<string | null> {
  return fetch(`https://itunes.apple.com/lookup?id=${appId}`)
    .then((res) => res.json())
    .then((obj) => schema.safeParse(obj).data ?? null)
    .catch(() => null);
}

import { z } from 'astro:schema';

export const teamSchema = z.object({
  id: z.coerce.number(),
  name: z.string(),
  shieldUrl: z
    .string()
    .url()
    .default('https://www.rfebm.com/competiciones/images/escudos/sinescudo.jpg'),
  score: z.coerce.number().default(0),
});

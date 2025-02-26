import { z } from 'zod';
import { shieldImageUrl } from './shield-image-url';

export const teamSchema = z.object({
  id: z.coerce.number(),
  name: z.string(),
  shieldUrl: shieldImageUrl,
  score: z.coerce.number().nullable().default(null),
  position: z.coerce.number().nullable().default(null),
  responsibleId: z.coerce.number().nullable().default(null),
  category: z.string().or(z.number()).nullable().default(null),
});

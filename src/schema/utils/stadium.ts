import { z } from 'astro:schema';

export const stadiumSchema = z.object({
  id: z.coerce.number(),
  name: z.string(),
  address: z.string().nullable(),
  latitude: z.string().nullable(),
  longitude: z.string().nullable(),
  city: z.string().nullable().default(null).optional(),
  capacity: z.coerce.number().nullable().default(null),
});

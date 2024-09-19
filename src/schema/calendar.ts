import { z } from 'astro:schema';
import { matchSchema } from './utils/match';

export const calendarSchema = z.object({
  calendarios: z.array(matchSchema),
});

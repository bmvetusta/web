import { z } from 'zod';
import { matchSchema } from '../generics/match';
import { transformableCalendarMatchSchema } from './match';

export const calendarResponseSchema = z
  .object({
    calendarios: z.array(transformableCalendarMatchSchema.innerType()).default([]),
  })
  .transform((v) => v.calendarios.map((m) => transformableCalendarMatchSchema.parse(m)))
  .pipe(z.array(matchSchema));

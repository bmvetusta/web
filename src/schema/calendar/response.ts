import { z } from 'zod';
import { calendarMatchSchema, transformableCalendarMatchSchema } from './match';

export const calendarResponseSchema = z
  .object({
    calendarios: z.array(transformableCalendarMatchSchema.innerType()).default([]),
  })
  .transform((v) => transformableCalendarMatchSchema.safeParse(v.calendarios).data ?? [])
  .pipe(z.array(calendarMatchSchema));

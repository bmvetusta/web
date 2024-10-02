import { z } from 'zod';
import { transformableCalendarMatchSchema } from './match';

const calendarArray = z.array(transformableCalendarMatchSchema);
export const calendarResponseSchema = z
  .object({
    calendarios: calendarArray.default([]),
  })
  .transform((v) => v.calendarios as z.output<typeof calendarArray>)
  .pipe(calendarArray);

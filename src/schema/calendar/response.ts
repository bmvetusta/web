import { z } from 'zod';
import { matchSchema } from '../generics/match';
import { transformableMatchCalendarSchema } from './match';

const calendarsArraySchema = z.array(transformableMatchCalendarSchema);

export const responseCalendarSchema = z
  .object({
    calendarios: calendarsArraySchema,
  })
  .transform((v) => v.calendarios)
  .pipe(z.array(matchSchema).min(1));

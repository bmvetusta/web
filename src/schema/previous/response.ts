import { z } from 'zod';
import { inputResponsePreviousSchema } from './input-response';

export const responsePreviousSchema = z
  .object({
    previo: z.any(),
  })
  .transform((v) => v.previo)
  .pipe(inputResponsePreviousSchema);

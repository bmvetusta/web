import { z } from 'zod';

export const reponseErrorSchema = z.object({
  ok: z.literal('KO'),
  error: z.any(),
});

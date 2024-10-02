import { z } from 'zod';

export const date = z
  .string()
  .transform((d) => d.split('-').reverse().join('-'))
  .pipe(z.string().date());

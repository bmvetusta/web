import { z } from 'astro:schema';

export const date = z
  .string()
  .transform((d) => d.split('-').reverse().join('-'))
  .pipe(z.string().date());

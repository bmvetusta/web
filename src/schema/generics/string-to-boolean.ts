import { z } from 'zod';

export const stringToBooleanSchema = z
  .string()
  .transform((v) => v.toLowerCase())
  .transform((v) => v === '1' || v === 'on' || v === 'true');

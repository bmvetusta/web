import { capitalizeString } from 'src/lib/capitalize-string';
import { z } from 'zod';

export const capitalizedStringSchema = (all = false, locales: Intl.LocalesArgument = 'es-ES') =>
  z
    .string()
    .transform((v) =>
      typeof v === 'string' && v.length > 0 ? capitalizeString(v, all, locales) : v
    )
    .pipe(z.string());

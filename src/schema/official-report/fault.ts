import { z } from 'zod';

export const faultOfficialReportSchema = z.object({
  id: z.coerce.number(),
  nombre: z.string(),
  minuto: z.coerce.number(),
  dorsal: z.coerce.number().default(0),
  bloque: z.string(), // Primera parte | Segunda parte
  tipo: z.string(),
});

import { z } from 'zod';

export const matchStatsOfficialReportSchema = z
  .object({
    evento: z.string(),
    local: z.coerce.number(),
    visitante: z.coerce.number(),
  })
  .transform((stats) => ({
    event: stats.evento,
    home: stats.local,
    away: stats.visitante,
  }));

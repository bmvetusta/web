import { z } from 'zod';
import { matchStatusSchema } from './match-status';
import { teamSchema } from './team';

export const matchSchema = z.object({
  id: z.number(),
  groupId: z.coerce.number().nullable().default(null),
  uploadedReport: z.boolean().nullable().default(null),
  competitionName: z.string().nullish(),
  week: z.number(),
  urlStreaming: z.string().nullable().default(null),
  status: matchStatusSchema,
  date: z.string().nullable().default(null),
  time: z.string().nullable().default(null),
  localTeam: teamSchema,
  visitorTeam: teamSchema,
});

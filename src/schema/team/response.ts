import { z } from 'zod';
import { teamSchema, transformTeamSchema } from './team';

export const teamResponseSchema = z
  .object({
    equipo: transformTeamSchema,
  })
  .transform((v) => v.equipo)
  .pipe(teamSchema);

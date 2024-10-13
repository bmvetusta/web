import { z } from 'zod';
import { stringToBooleanSchema } from '../generics/string-to-boolean';

export const goalOfficialReportSchema = z
  .object({
    id: z.coerce.number(),
    nombre: z.string(),
    id_equipo: z.coerce.number(),
    nombre_equipo: z.string(),
    minuto: z.coerce.number(),
    dorsal: z.coerce.number().default(0),
    bloque: z.string(), // "Primera parte" | "Segunda parte"
    comentario: z.string(),
    es_penalti: stringToBooleanSchema,
    es_propia: stringToBooleanSchema,
  })
  .transform((goal) => ({
    teamId: goal.id_equipo,
    player: {
      id: goal.id,
      name: goal.nombre,
      teamId: goal.id_equipo,
      number: goal.dorsal,
    },
    minute: goal.minuto,
    block: goal.bloque,
    comment: goal.comentario,
    isPenalty: goal.es_penalti,
    isOwnGoal: goal.es_propia,
  }));

import { z } from 'zod';
import { shieldImageUrl } from '../generics/shield-image-url';
import { teamSchema } from '../generics/team';

export const teamWeekSchema = z
  .object({
    id: z.coerce.number(),
    responsable: z.coerce.number(),
    nombre: z.string(),
    categoria: z.string(),
    imagen: shieldImageUrl,
  })
  .transform((v) =>
    teamSchema.parse({
      id: v.id,
      name: v.nombre,
      responsibleId: v.responsable,
      shieldImageUrl: v.imagen,
      category: v.categoria,
    })
  );

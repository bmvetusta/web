import { z } from 'zod';

export const calendarTeamSchema = z.object({
  id: z.number(),
  responsibleId: z.number(),
  name: z.string(),
  category: z.string(),
  shieldUrl: z.string().url(),
});

export const transformableCalendarTeamSchema = z
  .object({
    id: z.coerce.number(),
    nombre: z.string(),
    categoria: z.string(),
    responsable: z.coerce.number(),
    imagen: z.string().url(),
  })
  .transform((v) => ({
    id: v.id,
    responsibleId: v.responsable,
    name: v.nombre,
    category: v.categoria,
    shieldUrl: v.imagen,
  }));

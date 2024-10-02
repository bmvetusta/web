import { z } from 'zod';

export const seasonSchema = z.object({
  id: z.number(),
  name: z.string(),
  start: z.string(),
  end: z.string(),
});

export const transformableSeasonSchema = z
  .object({
    id: z.coerce.number(),
    nombre: z.string(),
  })
  .transform((s) => {
    const [, start, end] = s.nombre.split(/[\/\s]/);
    return {
      id: s.id,
      name: s.nombre,
      start: `${start}-07-01`,
      end: `${end}-06-30`,
    };
  });

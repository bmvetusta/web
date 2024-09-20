import { z } from 'astro:schema';

export const pipedRefereeSchema = z.object({
  name: z.string(),
  photoUrl: z.string().url(),
  role: z.string(),
  roleId: z.coerce.number().or(z.string()),
});

export const refereeSchema = z
  .object({
    arbitro: z.string(),
    foto: z.string().url(),
    tipo: z.string(),
    id_tipo: z.coerce.number().or(z.string()),
  })
  .transform((r) => ({
    name: r.arbitro,
    photoUrl: r.foto,
    role: r.tipo,
    roleId: r.id_tipo,
  }))
  .pipe(pipedRefereeSchema);

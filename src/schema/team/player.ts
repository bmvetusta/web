import { z } from 'zod';
import { profilePhotoUrl } from '../generics/profile-photo-url';
import { stringToBooleanSchema } from '../generics/string-to-boolean';

export const playerTeamSchema = z.object({
  id: z.number(),
  name: z.string(),
  profileImageUrl: profilePhotoUrl,
  class: z.string(),
  isPlayer: z.boolean(),
});

export const transformablePlayerTeamSchema = z
  .object({
    id: z.coerce.number(),
    nombre: z.string(), // capitalizedStringSchema(true, 'es-ES'), // This can be a limit because there are players from many nationalities
    imagen: profilePhotoUrl,
    clase: z.string(), // z.enum(['JUGADOR', 'INVITADO', 'OFICIAL', 'STAFF ADICIONAL']), // Sure there are more
    es_jugador: stringToBooleanSchema.innerType(),
  })
  .transform((v) => ({
    id: v.id,
    name: v.nombre,
    profileImageUrl: v.imagen,
    class: v.clase,
    isPlayer: stringToBooleanSchema.safeParse(v.es_jugador).data,
  }));

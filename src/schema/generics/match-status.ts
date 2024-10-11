import { z } from 'zod';

export const matchStatusSchema = z.enum([
  'ENDED',
  'PENDING',
  'PLAYING',
  'ENDED BY SUSPENSIONS',
  'SUSPENDED',
  'UNKNOWN',
]);

export const transformableMatchStatusSchema = z
  .string()
  .default('unknown')
  // .enum(['Finalizado', 'Pendiente', 'en progreso', 'Finalizado por exclusion', 'Suspendido'])
  .transform((v) => {
    switch (v.toLocaleLowerCase('es-ES')) {
      case 'finalizado':
        return 'ENDED';
      case 'finalizado por exclusion':
        return 'ENDED BY SUSPENSIONS';
      case 'en progreso':
        return 'PLAYING';
      case 'pendiente':
        return 'PENDING';
      case 'suspendido':
        return 'SUSPENDED';
      default:
        return 'UNKNOWN';
    }
  });

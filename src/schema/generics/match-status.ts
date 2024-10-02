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
    switch (v) {
      case 'Finalizado':
        return 'ENDED';
      case 'Finalizado por exclusion':
        return 'ENDED BY SUSPENSIONS';
      case 'en progreso':
        return 'PLAYING';
      case 'Pendiente':
        return 'PENDING';
      case 'Suspendido':
        return 'SUSPENDED';
      default:
        return 'UNKNOWN';
    }
  });

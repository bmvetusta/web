import { z } from 'zod';

export const shieldImageUrl = z
  .string()
  .url()
  .default('https://www.rfebm.com/competiciones/images/escudos/sinescudo.jpg');

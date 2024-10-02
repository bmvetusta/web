import { z } from 'zod';

export const profilePhotoUrl = z
  .string()
  .url()
  .default('https://upload.wikimedia.org/wikipedia/commons/c/c1/Sin_fotograf%C3%ADa.jpg');

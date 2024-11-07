import { z } from 'zod';

// [[HH:]mm:]ss.ms
const convertSemicolonTimeToMs = (time: string) => {
  const parts = time.split(':').map(Number);
  if (parts.some(Number.isNaN)) {
    throw new Error('Invalid time format');
  }

  let seconds = 0;
  let minutes = 0;
  let hours = 0;
  if (parts.length === 1) {
    seconds = parts[0];
  } else if (parts.length === 2) {
    minutes = parts[0];
    seconds = parts[1];
  } else if (parts.length === 3) {
    hours = parts[0];
    minutes = parts[1];
    seconds = parts[2];
  }

  return hours * 3_600_000 + minutes * 60_000 + seconds * 1000;
};

export const timeInMsSchema = z.coerce
  .number()
  .default(0)
  .or(
    z
      .string()
      .refine((v) => v.includes(':'), {
        message: 'Invalid time format',
      })
      .transform(convertSemicolonTimeToMs)
      .pipe(z.coerce.number())
  );

import { z } from 'astro:schema';

export const datetime = z
  .string()
  .transform((d) => {
    const [dateString, timeString] = d.split(' ');

    const date = dateString ? dateString.split('-').reverse().join('-') : null;
    const time = timeString ? timeString.split(':').slice(0, 2).join(':') : null;

    return {
      date,
      time,
    };
  })
  .pipe(
    z.object({
      date: z.string().nullable().optional(),
      time: z.string().nullable().optional(),
    })
  );

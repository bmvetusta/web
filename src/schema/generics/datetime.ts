import { z } from 'zod';

export const dateTimeSchema = z.object({
  date: z.string().nullable().optional(),
  time: z.string().nullable().optional(),
});

export const transformableDateSchema = z
  .string()
  .nullable()
  .default(null)
  .transform((d) => {
    if (d) {
      const [dateString, timeString] = d.split(' ');

      const date = dateString ? dateString.split('-').join('-') : null;
      const time = timeString ? timeString.split(':').slice(0, 2).join(':') : null;

      return {
        date,
        time,
      };
    }

    return {
      date: null,
      time: null,
    };
  });

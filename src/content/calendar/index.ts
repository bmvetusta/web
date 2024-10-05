import { file } from 'astro/loaders';
import { defineCollection } from 'astro:content';
import { responseCalendarSchema } from 'src/schema/calendar/response';

export const calendar = defineCollection({
  loader: file('src/content/team/data.json'),
  schema: responseCalendarSchema._output,
});

import { describe, expect, test } from 'bun:test';
import { responseCalendarSchema } from 'src/schema/calendar/response';
import calendar from '../mock/calendario.json' with { type: 'json' };

test('Check for Calendar JSON Data', () => {
  describe('Check parse schema', () => {
    const data = responseCalendarSchema.safeParse(calendar);

    // if (data.success === false) {
    //   console.error(data.error?.errors);
    // }

    expect(data.success).toBe(true);
  });
});

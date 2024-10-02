import { describe, expect, test } from 'bun:test';
import { responseWeeksSchema } from 'src/schema/weeks/response';
import weeks from '../mock/jornadas.json' with { type: 'json' };

test('Check for Weeks JSON Data', () => {
  describe('Check schema parser', () => {
    const data = responseWeeksSchema.safeParse(weeks);

    if (data.success === false) {
      console.error(data.error?.errors);
    }

    expect(data.success).toBe(true);
  });
});

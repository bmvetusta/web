import { describe, expect, test } from 'bun:test';
import { responseInitialSchema } from 'src/schema/initial/response';
import initialData from '../mock/datos-iniciales.json' with { type: 'json' };

test('Check for Initial Data', () => {
  describe('Check parse schema', () => {
    const data = responseInitialSchema.safeParse(initialData);

    // if (data.success === false) {
    // 	console.error(data.error?.errors);
    // }

    expect(data.success).toBe(true);
  });
});

import { describe, expect, test } from 'bun:test';
import { responsePreviousSchema } from 'src/schema/previous/response';
import previousResponse from '../mock/previo.json' with { type: 'json' };

test('Check for Previous JSON Data', () => {
  describe('Check parse schema', () => {
    const data = responsePreviousSchema.safeParse(previousResponse);
    if (data.success) {
      console.log(JSON.stringify(data.data));
    }

    // if (data.success === false) {
    //   console.error(data.error?.errors);
    // }

    expect(data.success).toBe(true);
  });
});

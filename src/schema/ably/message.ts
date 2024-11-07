import { z } from 'zod';

export const ablyMessageSchema = z
  .object({
    clientId: z.string({ description: 'The client ID of the publisher of this message.' }),
    connectionId: z.string({ description: 'The connection ID of the publisher of this message.' }),
    data: z.any({ description: 'The message payload, if provided.' }),
    encoding: z
      .string({
        description:
          'This is typically empty, as all messages received from Ably are automatically decoded client-side using this value. However, if the message encoding cannot be processed, this attribute contains the remaining transformations not applied to the `data` payload.',
      })
      .nullable(),
    extras: z.any({
      description:
        'A JSON object of arbitrary key-value pairs that may contain metadata, and/or ancillary payloads. Valid payloads include `push`, `delta`, `ref` and `headers`.',
    }),
    id: z.string({ description: 'Unique ID assigned by Ably to this message.' }),
    name: z.string({ description: 'The event name.' }),
    timestamp: z.number({
      description:
        'Timestamp of when the message was received by Ably, as milliseconds since the Unix epoch.',
    }),
  })
  .partial();

export type InputSchemaType<T extends z.ZodType | z.ZodEffects<z.ZodType> = z.ZodTypeAny> = T;

export type ApiFetcher<T extends InputSchemaType = z.ZodTypeAny> =
  () => Promise<z.output<T> | null>;

export type ApiFetcherFactory<T extends InputSchemaType = z.ZodTypeAny> = (
  url: URL,
  schema: T,
  body?: URLSearchParams
) => ApiFetcher<T>;

export type RedisStoredObject<T extends InputSchemaType> = {
  data: z.output<T>;
  createdAt: number;
  isFallback: boolean;
};

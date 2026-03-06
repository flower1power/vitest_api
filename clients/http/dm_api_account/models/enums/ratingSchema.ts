import { z } from 'zod';

export const RatingSchema = z
  .object({
    enabled: z.boolean(),
    quality: z.number().int(),
    quantity: z.number().int(),
  })
  .strict();

export type RatingDTO = z.infer<typeof RatingSchema>;

import { z } from 'zod';
import { DbParseModeZod } from './enums/index.js';

export const InfoBbTextSchema = z
  .object({
    value: z.string().optional(),
    parseMode: DbParseModeZod,
  })
  .strict();

export type InfoBbTextDTO = z.infer<typeof InfoBbTextSchema>;

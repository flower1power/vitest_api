import { z } from 'zod';
import { DbParseMode } from './enums/index.js';

export const InfoBbTextSchema = z
  .object({
    value: z.string().optional(),
    parseMode: z.enum(Object.values(DbParseMode) as [string, ...string[]]),
  })
  .strict();

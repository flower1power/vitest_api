import { z } from 'zod';
import { RatingSchema, UserRole } from './enums/index.js';

const UserSchema = z
  .object({
    login: z.string().optional(),
    roles: z.array(z.enum(Object.values(UserRole) as [string, ...string[]])),
    mediumPictureUrl: z.string().optional(),
    smallPictureUrl: z.string().optional(),
    status: z.string().optional(),
    rating: RatingSchema,
    online: z.coerce.date().optional(),
    name: z.string().optional(),
    location: z.string().optional(),
    registration: z.coerce.date().optional(),
  })
  .strict();

export const UserEnvelopeSchema = z.object({
  resource: UserSchema,
  metadata: z.record(z.string(), z.string()).optional(),
});

export type UserEnvelopeDTO = z.infer<typeof UserEnvelopeSchema>;

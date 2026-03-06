import { z } from 'zod';
import { RatingSchema, UserRoleZod } from './enums/index.js';

export const UserSchema = z
  .object({
    login: z.string().optional(),
    roles: z.array(UserRoleZod),
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

export type UserDTO = z.infer<typeof UserSchema>;

export const UserEnvelopeSchema = z.object({
  resource: UserSchema,
  metadata: z.record(z.string(), z.string()).optional(),
});

export type UserEnvelopeDTO = z.infer<typeof UserEnvelopeSchema>;

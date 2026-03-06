import { z } from 'zod';
import { ColorSchemaZod, RatingSchema, UserRoleZod } from './enums/index.js';

export const PagingSettingsSchema = z
  .object({
    postsPerPage: z.number().int(),
    commentsPerPage: z.number().int(),
    topicsPerPage: z.number().int(),
    messagesPerPage: z.number().int(),
    entitiesPerPage: z.number().int(),
  })
  .strict();

export type PagingSettingsDTO = z.infer<typeof PagingSettingsSchema>;

export const UserSettingsSchema = z
  .object({
    colorSchema: ColorSchemaZod,
    nannyGreetingsMessage: z.string().optional(),
    paging: PagingSettingsSchema,
  })
  .strict();

export type UserSettingsDTO = z.infer<typeof UserSettingsSchema>;

export const UserDetailsSchema = z
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
    icq: z.string().optional(),
    skype: z.string().optional(),
    originalPictureUrl: z.string().optional(),
    info: z.string(),
    settings: UserSettingsSchema,
  })
  .strict();

export type UserDetailsDTO = z.infer<typeof UserDetailsSchema>;

export const UserDetailsEnvelopeSchema = z
  .object({
    resource: UserDetailsSchema,
    metadata: z.string().optional(),
  })
  .strict();

export type UserDetailsEnvelopeDTO = z.infer<typeof UserDetailsEnvelopeSchema>;

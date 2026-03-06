import { z } from 'zod';

export const ChangePasswordSchema = z
  .object({
    login: z.string(),
    token: z.string(),
    oldPassword: z.string(),
    newPassword: z.string(),
  })
  .strict();

export type ChangePasswordDTO = z.infer<typeof ChangePasswordSchema>;

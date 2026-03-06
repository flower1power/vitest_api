import { z } from 'zod';

export enum UserRole {
  GUEST = 'Guest',
  PLAYER = 'Player',
  ADMINISTRATOR = 'Administrator',
  NANNY_MODERATOR = 'NannyModerator',
  REGULAR_MODERATOR = 'RegularModerator',
  SENIOR_MODERATOR = 'SeniorModerator',
}

export const UserRoleZod = z.nativeEnum(UserRole);

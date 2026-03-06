import { z } from 'zod';

export enum DbParseMode {
  COMMON = 'Common',
  INFO = 'Info',
  POST = 'Post',
  CHAT = 'Chat',
}

export const DbParseModeZod = z.nativeEnum(DbParseMode);

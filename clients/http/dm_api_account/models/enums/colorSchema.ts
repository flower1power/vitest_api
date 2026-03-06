import { z } from 'zod';

export enum ColorSchema {
  MODERN = 'Modern',
  PALE = 'Pale',
  CLASSIC = 'Classic',
  CLASSIC_PALE = 'ClassicPale',
  NIGHT = 'Night',
}

export const ColorSchemaZod = z.nativeEnum(ColorSchema);

import 'vitest';
import { z } from 'zod';
import { ApiResponse } from '@rest_client/api_response.js';

declare module 'vitest' {
  interface Assertion<T = any> {
    toHaveStatusCodeAPI<B>(url: string, body: B, requestBody: unknown, curl: string, expectedStatus: number): Promise<void>;
    toHaveStatusCode(expectedStatus: number): Promise<void>;
    toMatchSchemaAPI<U>(schema: z.ZodSchema<U>): Promise<void>;
    checkErrorBody(data: ApiResponse<unknown>, expectedErrorMessage: string): Promise<void>;
    toHaveHeader(headerName: string, expectedValue?: string): Promise<void>;
  }
}

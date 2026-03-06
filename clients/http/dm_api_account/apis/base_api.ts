import type { z } from 'zod';
import type { ApiResponse } from '@rest_client/index.js';
import { RestClient } from '@rest_client/index.js';

export abstract class DmApiBase extends RestClient {
  protected static readonly BASE_PATH = '/v1/account';

  protected parseResponse<T>(response: ApiResponse<T>, schema: z.ZodSchema<T>, validateResponse: boolean): T | ApiResponse<T> {
    if (validateResponse) {
      return schema.parse(response.body);
    }
    return response;
  }

  protected async parseResponseWithStatus<T>(
    response: ApiResponse<T>,
    schema: z.ZodSchema<T>,
    validateResponse: boolean,
    expectedStatus = 200,
  ): Promise<T | ApiResponse<T>> {
    if (validateResponse) {
      await response.toHaveStatusCode(expectedStatus);
      return response.toMatchSchema(schema);
    }
    return response;
  }
}

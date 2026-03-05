import { ApiResponse } from '@rest_client/index.js';

export function isApiResponse(value: unknown): value is ApiResponse {
  return value instanceof ApiResponse;
}

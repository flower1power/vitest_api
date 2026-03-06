import { ApiResponse } from '@rest_client/index.js';

export function isApiResponse<T = unknown>(value: T | ApiResponse<T>): value is ApiResponse<T> {
  return value instanceof ApiResponse;
}

export function extractBody<T>(data: T | ApiResponse<T>): T {
  if (isApiResponse(data)) {
    return data.body;
  }
  return data;
}

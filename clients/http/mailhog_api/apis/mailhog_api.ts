import { Step as step } from '@steps-flows/index.js';
import { ApiResponse, type RequestOptions, RestClient } from '@rest_client/index.js';

export class MailhogApi extends RestClient {
  @step('Получение писем из почтового ящика Mailhog')
  async getApiV2Message(limit: number = 50, options?: RequestOptions): Promise<ApiResponse> {
    return this.get(`/api/v2/messages`, { params: { limit }, headers: { ...options?.headers }, ...options });
  }
}

import { type LoginCredentialsDTO, type UserEnvelopeDTO, UserEnvelopeSchema } from '../models/index.js';
import { Step as step } from '@steps-flows/index.js';
import type { ApiResponse } from '@rest_client/index.js';
import { type RequestOptions, RestClient } from '@rest_client/index.js';

export class LoginApi extends RestClient {
  @step('Аутентификация пользователя')
  async postV1AccountLogin(
    jsonData: LoginCredentialsDTO,
    validateResponse = true,
    options?: RequestOptions,
  ): Promise<ApiResponse | UserEnvelopeDTO> {
    const response = await this.post(`/v1/account/login`, {
      data: jsonData,
      headers: { ...options?.headers },
      ...options,
    });

    if (validateResponse) {
      await response.toHaveStatusCode(200);
      return response.toMatchSchema(UserEnvelopeSchema);
    }

    return response;
  }

  /**
   * Выход пользователя из системы на текущем устройстве.
   * Требует предварительной авторизации пользователя
   * (токен должен быть установлен в заголовках сессии)
   * @param {RequestOptions} options - Параметры POST запроса
   * @returns {Promise<ApiResponse>} Ответ сервера
   */
  @step('Выход пользователя из системы на текущем устройстве')
  async deleteV1AccountLogin(options?: RequestOptions): Promise<ApiResponse> {
    return this.delete('/v1/account/login', { ...options });
  }

  /**
   * Выход пользователя из системы на всех устройствах.
   * Требует предварительной авторизации пользователя
   * (токен должен быть установлен в заголовках сессии)
   * @param {RequestOptions} options - Параметры DELETE запроса
   * @returns {Promise<ApiResponse>} Ответ сервера
   */
  @step('Выход пользователя из системы на всех устройствах')
  async deleteV1AccountLoginAll(options?: RequestOptions): Promise<ApiResponse> {
    return this.delete('/v1/account/login/all', { ...options });
  }
}

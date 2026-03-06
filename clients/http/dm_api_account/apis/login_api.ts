import { type LoginCredentialsDTO, type UserEnvelopeDTO, UserEnvelopeSchema } from '../models/index.js';
import { Step as step } from '@steps-flows/index.js';
import type { ApiResponse, RequestOptions } from '@rest_client/index.js';
import { DmApiBase } from './base_api.js';

export class LoginApi extends DmApiBase {
  async postV1AccountLogin(
    jsonData: LoginCredentialsDTO,
    validateResponse: true,
    options?: RequestOptions,
  ): Promise<UserEnvelopeDTO>;
  async postV1AccountLogin(
    jsonData: LoginCredentialsDTO,
    validateResponse: false,
    options?: RequestOptions,
  ): Promise<ApiResponse<UserEnvelopeDTO>>;
  async postV1AccountLogin(
    jsonData: LoginCredentialsDTO,
    validateResponse: boolean,
    options?: RequestOptions,
  ): Promise<ApiResponse<UserEnvelopeDTO> | UserEnvelopeDTO>;
  @step('Аутентификация пользователя')
  async postV1AccountLogin(
    jsonData: LoginCredentialsDTO,
    validateResponse = true,
    options?: RequestOptions,
  ): Promise<ApiResponse<UserEnvelopeDTO> | UserEnvelopeDTO> {
    const response = await this.post<UserEnvelopeDTO>(`${DmApiBase.BASE_PATH}/login`, {
      data: jsonData,
      headers: { ...options?.headers },
      ...options,
    });

    return this.parseResponseWithStatus<UserEnvelopeDTO>(response, UserEnvelopeSchema, validateResponse, 200);
  }

  @step('Выход пользователя из системы на текущем устройстве')
  async deleteV1AccountLogin(options?: RequestOptions): Promise<ApiResponse> {
    return this.delete(`${DmApiBase.BASE_PATH}/login`, { ...options });
  }

  @step('Выход пользователя из системы на всех устройствах')
  async deleteV1AccountLoginAll(options?: RequestOptions): Promise<ApiResponse> {
    return this.delete(`${DmApiBase.BASE_PATH}/login/all`, { ...options });
  }
}

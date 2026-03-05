import type {
  ChangeEmailDTO,
  ChangePasswordDTO,
  RegistrationDTO,
  ResetPasswordDTO,
  UserDetailsEnvelopeDTO,
  UserEnvelopeDTO,
} from '../models/index.js';
import { UserDetailsEnvelopeSchema, UserEnvelopeSchema } from '../models/index.js';
import { Step as step } from '@steps-flows/index.js';
import type { ApiResponse, RequestOptions } from '@rest_client/index.js';
import { RestClient } from '@rest_client/index.js';

export class AccountApi extends RestClient {
  @step('Регистрация нового пользователя')
  async postV1Account(jsonData: RegistrationDTO, options?: RequestOptions): Promise<ApiResponse> {
    return this.post(`/v1/account`, { headers: { ...options?.headers }, data: jsonData, ...options });
  }

  async getV1Account(validateResponse: true, options?: RequestOptions): Promise<UserDetailsEnvelopeDTO>;
  async getV1Account(validateResponse: false, options?: RequestOptions): Promise<ApiResponse>;
  @step('Получение информации о текущем пользователе')
  async getV1Account(validateResponse: boolean, options?: RequestOptions): Promise<ApiResponse | UserDetailsEnvelopeDTO> {
    const response = await this.get(`/v1/account`, { ...options });

    if (validateResponse) {
      return UserDetailsEnvelopeSchema.parse(response.body);
    }

    return response;
  }

  @step('Активация зарегистрированного пользователя по токену')
  async putV1AccountToken(
    token: string,
    validateResponse: boolean = true,
    options?: RequestOptions,
  ): Promise<ApiResponse | UserEnvelopeDTO> {
    const headers = { accept: 'text/plain', ...options?.headers };
    const response = await this.put(`/v1/account/${token}`, { headers, ...options });

    if (validateResponse) {
      return UserEnvelopeSchema.parse(response.body);
    }

    return response;
  }

  @step('Сброс пароля пользователя')
  async postV1AccountPassword(
    loginData: ResetPasswordDTO,
    validateResponse: boolean = true,
    options?: RequestOptions,
  ): Promise<ApiResponse | UserEnvelopeDTO> {
    const response = await this.post('/v1/account/password', { data: loginData, ...options });

    if (validateResponse) {
      return UserEnvelopeSchema.parse(response.body);
    }

    return response;
  }

  @step('Изменение пароля пользователя')
  async putV1AccountChangePassword(
    changePasswordData: ChangePasswordDTO,
    validateResponse: boolean = true,
    options?: RequestOptions,
  ): Promise<ApiResponse | UserEnvelopeDTO> {
    const response = await this.put(`/v1/account/password`, { data: changePasswordData, ...options });

    if (validateResponse) {
      return UserEnvelopeSchema.parse(response.body);
    }

    return response;
  }

  @step('Изменение email адреса зарегистрированного пользователя')
  async putV1AccountChangeEmail(
    changeEmailData: ChangeEmailDTO,
    validateResponse: boolean = true,
    options?: RequestOptions,
  ): Promise<ApiResponse | UserEnvelopeDTO> {
    const response = await this.put(`/v1/account/email`, { data: changeEmailData, ...options });

    if (validateResponse) {
      return UserEnvelopeSchema.parse(response.body);
    }

    return response;
  }
}

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
import { DmApiBase } from './base_api.js';

export class AccountApi extends DmApiBase {
  @step('Регистрация нового пользователя')
  async postV1Account(jsonData: RegistrationDTO, options?: RequestOptions): Promise<ApiResponse> {
    return this.post(DmApiBase.BASE_PATH, { headers: { ...options?.headers }, data: jsonData, ...options });
  }

  async getV1Account(validateResponse: true, options?: RequestOptions): Promise<UserDetailsEnvelopeDTO>;
  async getV1Account(validateResponse: false, options?: RequestOptions): Promise<ApiResponse<UserDetailsEnvelopeDTO>>;
  async getV1Account(
    validateResponse: boolean,
    options?: RequestOptions,
  ): Promise<ApiResponse<UserDetailsEnvelopeDTO> | UserDetailsEnvelopeDTO>;
  @step('Получение информации о текущем пользователе')
  async getV1Account(
    validateResponse: boolean,
    options?: RequestOptions,
  ): Promise<ApiResponse<UserDetailsEnvelopeDTO> | UserDetailsEnvelopeDTO> {
    const response = await this.get<UserDetailsEnvelopeDTO>(DmApiBase.BASE_PATH, { ...options });
    return this.parseResponse<UserDetailsEnvelopeDTO>(response, UserDetailsEnvelopeSchema, validateResponse);
  }

  async putV1AccountToken(token: string, validateResponse: true, options?: RequestOptions): Promise<UserEnvelopeDTO>;
  async putV1AccountToken(
    token: string,
    validateResponse: false,
    options?: RequestOptions,
  ): Promise<ApiResponse<UserEnvelopeDTO>>;
  async putV1AccountToken(
    token: string,
    validateResponse: boolean,
    options?: RequestOptions,
  ): Promise<ApiResponse<UserEnvelopeDTO> | UserEnvelopeDTO>;
  @step('Активация зарегистрированного пользователя по токену')
  async putV1AccountToken(
    token: string,
    validateResponse: boolean = true,
    options?: RequestOptions,
  ): Promise<ApiResponse<UserEnvelopeDTO> | UserEnvelopeDTO> {
    const headers = { accept: 'text/plain', ...options?.headers };
    const response = await this.put<UserEnvelopeDTO>(`${DmApiBase.BASE_PATH}/${token}`, { headers, ...options });
    return this.parseResponse<UserEnvelopeDTO>(response, UserEnvelopeSchema, validateResponse);
  }

  async postV1AccountPassword(
    loginData: ResetPasswordDTO,
    validateResponse: true,
    options?: RequestOptions,
  ): Promise<UserEnvelopeDTO>;
  async postV1AccountPassword(
    loginData: ResetPasswordDTO,
    validateResponse: false,
    options?: RequestOptions,
  ): Promise<ApiResponse<UserEnvelopeDTO>>;
  async postV1AccountPassword(
    loginData: ResetPasswordDTO,
    validateResponse: boolean,
    options?: RequestOptions,
  ): Promise<ApiResponse<UserEnvelopeDTO> | UserEnvelopeDTO>;
  @step('Сброс пароля пользователя')
  async postV1AccountPassword(
    loginData: ResetPasswordDTO,
    validateResponse: boolean = true,
    options?: RequestOptions,
  ): Promise<ApiResponse<UserEnvelopeDTO> | UserEnvelopeDTO> {
    const response = await this.post<UserEnvelopeDTO>(`${DmApiBase.BASE_PATH}/password`, { data: loginData, ...options });
    return this.parseResponse<UserEnvelopeDTO>(response, UserEnvelopeSchema, validateResponse);
  }

  async putV1AccountChangePassword(
    data: ChangePasswordDTO,
    validateResponse: true,
    options?: RequestOptions,
  ): Promise<UserEnvelopeDTO>;
  async putV1AccountChangePassword(
    data: ChangePasswordDTO,
    validateResponse: false,
    options?: RequestOptions,
  ): Promise<ApiResponse<UserEnvelopeDTO>>;
  async putV1AccountChangePassword(
    data: ChangePasswordDTO,
    validateResponse: boolean,
    options?: RequestOptions,
  ): Promise<ApiResponse<UserEnvelopeDTO> | UserEnvelopeDTO>;
  @step('Изменение пароля пользователя')
  async putV1AccountChangePassword(
    changePasswordData: ChangePasswordDTO,
    validateResponse: boolean = true,
    options?: RequestOptions,
  ): Promise<ApiResponse<UserEnvelopeDTO> | UserEnvelopeDTO> {
    const response = await this.put<UserEnvelopeDTO>(`${DmApiBase.BASE_PATH}/password`, { data: changePasswordData, ...options });
    return this.parseResponse<UserEnvelopeDTO>(response, UserEnvelopeSchema, validateResponse);
  }

  async putV1AccountChangeEmail(data: ChangeEmailDTO, validateResponse: true, options?: RequestOptions): Promise<UserEnvelopeDTO>;
  async putV1AccountChangeEmail(
    data: ChangeEmailDTO,
    validateResponse: false,
    options?: RequestOptions,
  ): Promise<ApiResponse<UserEnvelopeDTO>>;
  async putV1AccountChangeEmail(
    data: ChangeEmailDTO,
    validateResponse: boolean,
    options?: RequestOptions,
  ): Promise<ApiResponse<UserEnvelopeDTO> | UserEnvelopeDTO>;
  @step('Изменение email адреса зарегистрированного пользователя')
  async putV1AccountChangeEmail(
    changeEmailData: ChangeEmailDTO,
    validateResponse: boolean = true,
    options?: RequestOptions,
  ): Promise<ApiResponse<UserEnvelopeDTO> | UserEnvelopeDTO> {
    const response = await this.put<UserEnvelopeDTO>(`${DmApiBase.BASE_PATH}/email`, { data: changeEmailData, ...options });
    return this.parseResponse<UserEnvelopeDTO>(response, UserEnvelopeSchema, validateResponse);
  }
}

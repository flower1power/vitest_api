import {
  type ChangeEmailDTO,
  type ChangePasswordDTO,
  type LoginCredentialsDTO,
  type RegistrationDTO,
  type ResetPasswordDTO,
  type UserEnvelopeDTO,
} from '@dm_api_account/models/index.js';
import { ApiDmAccount, ApiMailhog } from '@service/index.js';
import { type ApiResponse } from '@rest_client/index.js';
import { expect } from 'vitest';
import { Retries, Step as step } from '@steps-flows/index.js';

export class AccountHelpers {
  constructor(
    public apiDmAccount: ApiDmAccount,
    public apiMailhog: ApiMailhog,
  ) {}

  async registerNewUser(credentialsData: RegistrationDTO): Promise<ApiResponse> {
    return this.apiDmAccount.accountApi.postV1Account(credentialsData);
  }

  async registerAndActivationNewUser(
    login: string,
    password: string,
    email: string,
    validateResponse: false,
  ): Promise<ApiResponse>;
  async registerAndActivationNewUser(
    login: string,
    password: string,
    email: string,
    validateResponse: true,
  ): Promise<UserEnvelopeDTO>;
  @step('Регистрация нового пользователя с последующей активацией')
  async registerAndActivationNewUser(
    login: string,
    password: string,
    email: string,
    validateResponse: boolean,
  ): Promise<ApiResponse | UserEnvelopeDTO> {
    const credentialsData: RegistrationDTO = { login: login, email: email, password: password };

    await this.registerNewUser(credentialsData);

    const token = await this.getActivationTokenByLogin(login);
    expect(token, `Проверка что токен пользователя существует`).not.toBeUndefined();

    const response = await this.apiDmAccount.accountApi.putV1AccountToken(token!, validateResponse);

    if (!validateResponse) expect((response as ApiResponse).status).toBe(200);

    return response;
  }

  async userLogin(
    login: string,
    password: string,
    rememberMe?: boolean,
    validateResponse?: false,
    validateHeader?: boolean,
  ): Promise<ApiResponse>;
  async userLogin(
    login: string,
    password: string,
    rememberMe?: boolean,
    validateResponse?: true,
    validateHeader?: boolean,
  ): Promise<UserEnvelopeDTO>;
  @step('Авторизация пользователя в системе')
  async userLogin(
    login: string,
    password: string,
    rememberMe = true,
    validateResponse = false,
    validateHeader = false,
  ): Promise<ApiResponse | UserEnvelopeDTO> {
    const loginData: LoginCredentialsDTO = {
      login: login,
      password: password,
      rememberMe: rememberMe,
    };

    const response = await this.apiDmAccount.loginApi.postV1AccountLogin(loginData, validateResponse);

    if (!validateResponse && validateHeader) expect((response as ApiResponse).headers['x-dm-auth-token']).toBeTruthy();

    return response;
  }

  @step('Авторизация клиента и установка токена аутентификации в заголовки')
  async authUser(login: string, password: string, rememberMe = true): Promise<void> {
    const response = await this.userLogin(login, password, rememberMe, false, false);

    const token = { 'x-dm-auth-token': response.headers['x-dm-auth-token'] };

    this.apiDmAccount.accountApi.setHeaders(token);
    this.apiDmAccount.loginApi.setHeaders(token);
  }

  @step('Получение токена активации для пользователя по логину')
  @Retries(5)
  async getActivationTokenByLogin(login: string): Promise<string | undefined> {
    const response = await this.apiMailhog.mailhogApi.getApiV2Message();
    expect(response.status).toBe(200);

    const responseJson = response.body as any;

    for (const item of responseJson.items) {
      const userData = JSON.parse(item.Content.Body);
      const userLogin = userData.Login;

      if (userLogin === login) return userData.ConfirmationLinkUrl.split('/').at(-1);
    }

    return undefined;
  }

  @step('Получение токена сброса пароля для пользователя по логину')
  @Retries(5)
  async getResetPasswordTokenByLogin(login: string): Promise<string | undefined> {
    const response = await this.apiMailhog.mailhogApi.getApiV2Message();
    expect(response.status).toBe(200);

    const responseJson = response.body as any;

    for (const item of responseJson.items) {
      const userData = JSON.parse(item.Content.Body);
      const userLogin = userData.Login;

      if (userLogin === login) {
        if ('ConfirmationLinkUri' in userData) return userData.ConfirmationLinkUri.split('/').at(-1);
      }
    }

    return undefined;
  }

  @step('Смена пароля пользователя с использованием токена сброса пароля')
  async changePassword(
    login: string,
    email: string,
    oldPassword: string,
    newPassword: string,
    validateResponse = true,
  ): Promise<ApiResponse<UserEnvelopeDTO> | UserEnvelopeDTO> {
    const loginData: ResetPasswordDTO = { login: login, email: email };

    await this.apiDmAccount.accountApi.postV1AccountPassword(loginData, validateResponse);

    const resetToken = await this.getResetPasswordTokenByLogin(login);

    expect(resetToken, `Токен для сброса пароля пользователя ${login} не был получен`).not.toBeUndefined();

    const changePasswordData: ChangePasswordDTO = {
      login: login,
      token: resetToken!,
      oldPassword: oldPassword,
      newPassword: newPassword,
    };

    const response = await this.apiDmAccount.accountApi.putV1AccountChangePassword(changePasswordData, validateResponse);

    if (validateResponse) return response as UserEnvelopeDTO;

    const apiResponse = response as ApiResponse<UserEnvelopeDTO>;
    expect(apiResponse.status).toBe(200);

    return apiResponse;
  }

  @step('Изменение email адреса пользователя')
  async changeEmail(
    login: string,
    password: string,
    newEmail: string,
    validateResponse = true,
  ): Promise<ApiResponse<UserEnvelopeDTO> | UserEnvelopeDTO> {
    const changeEmailData: ChangeEmailDTO = { login: login, password: password, email: newEmail };

    const response = await this.apiDmAccount.accountApi.putV1AccountChangeEmail(changeEmailData, validateResponse);

    if (validateResponse) return response as UserEnvelopeDTO;

    const apiResponse = response as ApiResponse<UserEnvelopeDTO>;
    expect(apiResponse.status).toBe(200);

    return apiResponse;
  }

  @step('Выход пользователя из системы на текущем устройстве')
  async logoutUser(token?: string, options: Record<string, any> = {}): Promise<ApiResponse> {
    if (token) options.headers = { ...options.headers, 'x-dm-auth-token': token };

    const response = await this.apiDmAccount.loginApi.deleteV1AccountLogin(options);
    expect(response.status).toBe(204);

    return response;
  }

  @step('Выход пользователя из системы на всех устройствах')
  async logoutUserAllDevice(token?: string, options: Record<string, any> = {}): Promise<ApiResponse> {
    if (token) options.headers = { ...options.headers, 'x-dm-auth-token': token };

    const response = await this.apiDmAccount.loginApi.deleteV1AccountLoginAll();
    expect(response.status).toBe(204);

    return response;
  }

  @step('Активация зарегистрированного пользователя по токену')
  async activateUser(token: string, validateResponse = true): Promise<ApiResponse<UserEnvelopeDTO> | UserEnvelopeDTO> {
    const response = await this.apiDmAccount.accountApi.putV1AccountToken(token, validateResponse);

    if (validateResponse) return response as UserEnvelopeDTO;

    const apiResponse = response as ApiResponse<UserEnvelopeDTO>;
    expect(apiResponse.status).toBe(200);

    return apiResponse;
  }
}

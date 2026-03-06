import type { ApiResponse } from '@rest_client/index.js';
import { expect } from 'vitest';
import { Step as step } from '@steps-flows/index.js';
import type { UserEnvelopeDTO } from '@dm_api_account/models/index.js';
import { extractBody } from '@checkers/http_checkers.js';

export class PostV1Account {
  @step('Проверка ответа POST v1/account')
  static async checkValues(login: string, data: UserEnvelopeDTO | ApiResponse<UserEnvelopeDTO>): Promise<void> {
    const envelope = extractBody(data);
    const user = envelope.resource;

    const today = new Date().toISOString().slice(0, 10);
    const registration = user.registration instanceof Date ? user.registration.toISOString() : String(user.registration);

    expect(registration.startsWith(today)).toBeTruthy();

    expect(user.login).toEqual(login);

    if (user.registration && typeof user.registration === 'string') user.registration = new Date(user.registration);

    expect(user.registration).toBeInstanceOf(Date);

    expect(user.rating).toEqual({ enabled: true, quality: 0, quantity: 0 });
  }
}

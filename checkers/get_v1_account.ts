import { expect } from 'vitest';
import { Step as step } from '@steps-flows/index.js';
import { ColorSchema, type UserDetailsEnvelopeDTO, UserRole } from '@dm_api_account/models/index.js';
import { extractBody } from '@checkers/http_checkers.js';
import type { ApiResponse } from '@rest_client/api_response.js';
import { ok } from 'node:assert';

export class GetV1Account {
  @step('Проверка ответа метода GET v1_account')
  static async checkValues(data: UserDetailsEnvelopeDTO | ApiResponse<UserDetailsEnvelopeDTO>): Promise<void> {
    const envelope = extractBody(data);
    const user = envelope.resource;

    if (user.online && typeof user.online === 'string') user.online = new Date(user.online);
    ok(user.online);

    if (user.registration && typeof user.registration === 'string') user.registration = new Date(user.registration);
    ok(user.registration);

    user.online = new Date(user.online);
    user.registration = new Date(user.registration);

    expect(String(user.login).startsWith('Tyreek6609_02_2026__18_59_16')).toBeTruthy();
    expect(user.roles).toContain(UserRole.GUEST);
    expect(user.roles).toContain(UserRole.PLAYER);
    expect(user.roles).toHaveLength(2);

    expect(user.online).toBeInstanceOf(Date);
    expect(user.registration).toBeInstanceOf(Date);

    expect(user.info).toBe('');
    expect(user.mediumPictureUrl).toBeUndefined();
    expect(user.smallPictureUrl).toBeUndefined();
    expect(user.status).toBeUndefined();
    expect(user.name).toBeUndefined();
    expect(user.location).toBeUndefined();
    expect(user.icq).toBeUndefined();
    expect(user.skype).toBeUndefined();
    expect(user.originalPictureUrl).toBeUndefined();

    expect(user.rating).toEqual({ enabled: true, quality: 0, quantity: 0 });

    expect(user.settings.colorSchema).toBe(ColorSchema.MODERN);
    expect(user.settings.nannyGreetingsMessage).toBeUndefined();

    expect(user.settings.paging.postsPerPage).toBe(10);
    expect(user.settings.paging.commentsPerPage).toBe(10);
    expect(user.settings.paging.topicsPerPage).toBe(10);
    expect(user.settings.paging.messagesPerPage).toBe(10);
    expect(user.settings.paging.entitiesPerPage).toBe(10);
  }
}

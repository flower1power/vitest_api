import { describe, subSuite, test } from '@fixture/index.js';
import { UserEnvelopeSchema } from '@dm_api_account/models/index.js';

describe('Тесты на проверку метода POST v1/account/login', () => {
  test('Проверка авторизации пользователя', async ({ accountHelper, prepareUser }) => {
    await subSuite('Позитивные тесты');

    await accountHelper.registerAndActivationNewUser(prepareUser.login, prepareUser.password, prepareUser.email, true);
    const response = await accountHelper.userLogin(prepareUser.login, prepareUser.password, true, false);
    await response.checkSchema({ statusCode: 200, schema: UserEnvelopeSchema });
  });
});

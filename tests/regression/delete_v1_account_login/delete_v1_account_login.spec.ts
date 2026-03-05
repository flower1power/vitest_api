import { describe, subSuite, test } from '@fixture/index.js';

describe('Тесты на проверку метода DELETE v1/account/login', () => {
  test('Проверка выхода пользователя из системы', async ({ accountHelper, prepareUser }) => {
    await subSuite('Позитивные тесты');

    await accountHelper.registerAndActivationNewUser(prepareUser.login, prepareUser.password, prepareUser.email, true);
    await accountHelper.authUser(prepareUser.login, prepareUser.password);
    await accountHelper.logoutUser();
  });
});

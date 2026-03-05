import { faker } from '@faker-js/faker';
import { describe, subSuite, test } from '@fixture/index.js';

describe('Тесты на проверку метода PUT v1/account/password', () => {
  test('Проверка смены пароля пользователя', async ({ accountHelper, prepareUser }) => {
    await subSuite('Позитивные тесты');

    const user = prepareUser;
    const newPassword = faker.internet.password({ length: 10, memorable: true });

    await accountHelper.registerAndActivationNewUser(user.login, user.password, user.email, true);
    await accountHelper.authUser(user.login, user.password);
    await accountHelper.changePassword(user.login, user.email, user.password, newPassword);
    await accountHelper.authUser(user.login, newPassword);
  });
});

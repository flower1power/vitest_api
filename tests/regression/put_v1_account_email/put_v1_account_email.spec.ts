import { faker } from '@faker-js/faker';
import { describe, subSuite, test } from '@fixture/index.js';

describe('Тесты на проверку метода PUT v1/account/email', () => {
  test('Проверка смены почты пользователя', async ({ accountHelper, prepareUser }) => {
    await subSuite('Позитивные тесты');

    const login = prepareUser.login;
    const password = prepareUser.password;
    const email = prepareUser.email;
    const newEmail = `${prepareUser.login}${faker.string.alpha({ length: { min: 1, max: 5 } })}@mail.ru`;

    await accountHelper.registerAndActivationNewUser(login, password, email, true);
    await accountHelper.userLogin(login, password);
    await accountHelper.changeEmail(login, password, newEmail);
    const response = await accountHelper.userLogin(login, password);
    await response.checkError(403, 'User is inactive. Address the technical support for more details');
    const token = await accountHelper.getActivationTokenByLogin(login);
    await accountHelper.activateUser(token!);
    await accountHelper.userLogin(login, password);
  });
});

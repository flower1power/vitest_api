import { describe, parameter, subSuite, test } from '@fixture/index.js';
import { faker } from '@faker-js/faker';
import { PostV1Account } from '@checkers/index.js';

const now = new Date();
const data = now.toLocaleString('ru-RU', { hour12: false }).replace(/[-:T]/g, '_').replace(' ', '_');

const negativeTestCase: { login: string; password: string; email: string }[] = [
  {
    login: `${faker.person.firstName()}${faker.person.lastName()}_${data}`,
    password: faker.internet.password({ length: 5 }),
    email: faker.internet.email(),
  },
  {
    login: `${faker.person.firstName()}${faker.person.lastName()}_${data}`,
    password: faker.internet.password({ length: 10 }),
    email: faker.internet.email().replace('@', ''),
  },
  {
    login: faker.person.lastName()[0],
    password: faker.internet.password({ length: 10 }),
    email: faker.internet.email(),
  },
];

describe('Тесты на проверку метода POST v1/account', () => {
  test('Проверка регистрации нового пользователя', async ({ accountHelper, prepareUser }) => {
    await subSuite('Позитивные тесты');

    await accountHelper.registerAndActivationNewUser(prepareUser.login, prepareUser.password, prepareUser.email, true);
    const response = await accountHelper.userLogin(prepareUser.login, prepareUser.password, true, true);
    await PostV1Account.checkValues(prepareUser.login, response);
  });

  negativeTestCase.forEach(({ login, password, email }, index) => {
    test(`Проверка регистрации с невалидными данными case ${index}`, async ({ accountHelper }) => {
      await subSuite('Негативные тесты');
      await parameter('login', login);
      await parameter('password', password);
      await parameter('email', email);

      const response = await accountHelper.registerNewUser({ login, password, email });
      await response.checkError(400, 'Validation failed');
    });
  });
});

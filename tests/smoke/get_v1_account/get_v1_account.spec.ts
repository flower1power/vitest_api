import { describe, subSuite, test } from '@fixture/index.js';
import { GetV1Account } from '@checkers/index.js';

describe('Тесты на проверку метода GET v1/account', () => {
  test('Проверка получения информации об авторизованном пользователе', async ({ authAccountHelper }) => {
    await subSuite('Позитивные тесты');

    const response = await authAccountHelper.apiDmAccount.accountApi.getV1Account(false);
    await response.assertSuccessResponse(200, GetV1Account.checkValues);
  });

  test('Проверка получения информации о неавторизованном пользователе', async ({ accountHelper }) => {
    await subSuite('Негативные тесты');

    const response = await accountHelper.apiDmAccount.accountApi.getV1Account(false);
    await response.checkError(401, 'User must be authenticated');
  });
});

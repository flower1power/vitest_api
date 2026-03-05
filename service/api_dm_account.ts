import { AccountApi, LoginApi } from '@dm_api_account/apis/index.js';
import { Configuration } from '@rest_client/index.js';

export class ApiDmAccount {
  loginApi: LoginApi;
  accountApi: AccountApi;

  constructor(private configuration: Configuration) {
    this.loginApi = new LoginApi(this.configuration);
    this.accountApi = new AccountApi(this.configuration);
  }
}

import { MailhogApi } from '@mailhog_api/apis/index.js';
import { Configuration } from '@rest_client/index.js';

export class ApiMailhog {
  mailhogApi: MailhogApi;

  constructor(private configuration: Configuration) {
    this.mailhogApi = new MailhogApi(this.configuration);
  }
}

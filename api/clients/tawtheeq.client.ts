import { APIResponse } from '@playwright/test';
import { BaseApiClient } from './base.client';
import { SeedCaseJson } from '../../pages/seeder.page';
import { env } from '../../config/env';
import { loggedPost } from './log-request';

export class TawtheeqClient extends BaseApiClient {
  async seedCase(payload: SeedCaseJson): Promise<APIResponse> {
    return loggedPost(this.request, 'Tawtheeq', `${this.baseURL}/api/seeder/tawtheeq`, {
      data: payload,
      headers: {
        accept: '*/*',
        'content-type': 'application/json',
        origin: this.baseURL,
        referer: `${this.baseURL}/`,
        cookie: `access_token=${env.tawtheeq.accessToken}; refresh_token=${env.tawtheeq.refreshToken}`,
      },
    });
  }
}

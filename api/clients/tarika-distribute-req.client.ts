import { APIRequestContext } from '@playwright/test';
import { env } from '../../config/env';
import { SeedResult } from '../../pages/seeder.page';
import { loggedPost } from './log-request';

export class TarikaDistributeReqClient {
  private readonly baseURL = env.admin.apiURL.replace(/\/admin$/, '');

  constructor(private readonly request: APIRequestContext) {}

  async submitTarikaDistributeRequest(result: SeedResult, divisionId: string): Promise<void> {
    const url = `${this.baseURL}/api/v1/inheritance/Tarika_Distribute_Req/`;
    const payload = {
      idNumber: result.json.deceased.identityNumber,
      idType: 1,
      TarikaRequestNumber: divisionId,
    };

    await loggedPost(this.request, 'TarikaDistributeReq', url, {
      data: payload,
      headers: { 'content-type': 'application/json' },
    });
  }
}

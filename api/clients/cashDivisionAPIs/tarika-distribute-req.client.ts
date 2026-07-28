import { APIRequestContext } from '@playwright/test';
import { env } from '../../../config/env';
import { SeedResult } from '../../../pages/seeder.page';

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

    console.log('[TarikaDistributeReq] POST', url, JSON.stringify(payload));
    const response = await this.request.post(url, {
      data: payload,
      headers: { 'content-type': 'application/json' },
    });
    console.log('[TarikaDistributeReq] Response status:', response.status());
  }
}

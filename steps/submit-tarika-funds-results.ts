import { APIRequestContext } from '@playwright/test';
import { DivisionDashboardPage } from '../pages/division-pages/division-dashboard.page';
import { SeedResult } from '../pages/admin-pages/seeder.page';
import { TransferFundsResultClient } from '../api/clients/transfer-funds-result.client';

export class SubmitTarikaFundsResults {
  constructor(
    private readonly request: APIRequestContext,
    private readonly divisionDashboardPage: DivisionDashboardPage,
  ) {}

  /** Fetches the current warith heirs and submits the Tarika funds transfer results for them. */
  async run(divisionId: string, result: SeedResult): Promise<void> {
    const heirs = await this.divisionDashboardPage.getWarithHeirs(divisionId, result.heirsCount);
    await new TransferFundsResultClient(this.request).submitTarikaFundsResults(
      result.json.deceased.identityNumber,
      divisionId,
      heirs,
    );
  }
}

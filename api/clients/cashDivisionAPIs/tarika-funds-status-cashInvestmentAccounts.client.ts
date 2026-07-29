import { APIRequestContext } from '@playwright/test';
import { env } from '../../../config/env';
import { SeedResult } from '../../../pages/seeder.page';
import { loggedPost } from '../log-request';

const AssetType = { InvestmentAccount: 241 } as const;
const TransactionStatus = { Success: 250, Failure: 251 } as const;

export class TarikaFundsStatusCashInvestmentAccountsClient {
  private readonly baseURL = env.admin.apiURL.replace(/\/admin$/, '');

  constructor(private readonly request: APIRequestContext) {}

  async simulate(result: SeedResult, divisionId: string): Promise<void> {
    const deceasedIdNumber = result.json.deceased.identityNumber;
    const tarikaRequestNumber = divisionId;

    const investments = result.json.estateAssets.investments ?? [];
    if (investments.length === 0) {
      throw new Error(
        `No investment accounts found in estateAssets. Actual keys: ${Object.keys(result.json.estateAssets).join(', ')}`,
      );
    }

    const investmentAccountStatusList = investments.map((a) => ({
      transactionStatus: TransactionStatus.Success,
      AccountNumber: a.accountNumber,
    }));

    const url = `${this.baseURL}/api/v1/inheritance/Transfer_Tarika_Funds_Status/`;
    const payload = {
      model: {
        idNumber: deceasedIdNumber,
        requestStatus: 1,
        TarikaRequestNumber: tarikaRequestNumber,
        assetType: AssetType.InvestmentAccount,
        InvestmentAccountStatusList: investmentAccountStatusList,
        IsCompleted: true,
      },
    };

    await loggedPost(this.request, 'TarikaFundsStatusCashInvestmentAccounts', url, {
      data: payload,
      headers: { 'content-type': 'application/json' },
    });
  }
}

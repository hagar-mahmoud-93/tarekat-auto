import { APIRequestContext } from '@playwright/test';
import { env } from '../../../config/env';
import { SeedResult } from '../../../pages/seeder.page';
import { loggedPost } from '../log-request';

const AssetType = { BankAccount: 240, InvestmentAccount: 241 } as const;
const TransactionStatus = { Success: 250, Failure: 251 } as const;

export class TarikaFundsStatusClient {
  private readonly baseURL = env.admin.apiURL.replace(/\/admin$/, '');

  constructor(private readonly request: APIRequestContext) {}

  async simulate(result: SeedResult, divisionId: string): Promise<void> {
    const deceasedIdNumber = result.json.deceased.identityNumber;
    const tarikaRequestNumber = divisionId;

    const bankAccounts = result.json.estateAssets.bankAccounts ?? [];
    const investments = result.json.estateAssets.investments ?? [];
    const hasBoth = bankAccounts.length > 0 && investments.length > 0;

    if (bankAccounts.length === 0 && investments.length === 0) {
      throw new Error(
        `No accounts found in estateAssets. Actual keys: ${Object.keys(result.json.estateAssets).join(', ')}`,
      );
    }

    if (bankAccounts.length > 0) {
      await this.post(deceasedIdNumber, tarikaRequestNumber, {
        assetType: AssetType.BankAccount,
        listKey: 'BankAccountStatusList',
        emptyListKey: 'InvestmentAccountStatusList',
        accountList: bankAccounts.map((a) => ({
          IBAN: a.iban,
          transactionStatus: TransactionStatus.Success,
          ExchangeRate: 1.0,
          ErrorDescription: null,
          ErrorCode: null,
          Amount: parseFloat(a.balance),
        })),
        isCompleted: !hasBoth,
      });
    }

    if (investments.length > 0) {
      await this.post(deceasedIdNumber, tarikaRequestNumber, {
        assetType: AssetType.InvestmentAccount,
        listKey: 'InvestmentAccountStatusList',
        emptyListKey: 'BankAccountStatusList',
        accountList: investments.map((a) => ({
          transactionStatus: TransactionStatus.Success,
          AccountNumber: a.accountNumber,
        })),
        isCompleted: true,
      });
    }
  }

  private async post(
    deceasedIdNumber: string,
    tarikaRequestNumber: string,
    args: {
      assetType: 240 | 241;
      listKey: 'BankAccountStatusList' | 'InvestmentAccountStatusList';
      emptyListKey: 'BankAccountStatusList' | 'InvestmentAccountStatusList';
      accountList: unknown[];
      isCompleted: boolean;
    },
  ): Promise<void> {
    const url = `${this.baseURL}/api/v1/inheritance/Transfer_Tarika_Funds_Status/`;
    const payload = {
      model: {
        idNumber: deceasedIdNumber,
        assetType: args.assetType,
        IsCompleted: args.isCompleted,
        [args.listKey]: args.accountList,
        [args.emptyListKey]: [],
        TarikaRequestNumber: tarikaRequestNumber,
        requestStatus: 1,
      },
    };

    await loggedPost(this.request, 'TarikaFundsStatus', url, {
      data: payload,
      headers: { 'content-type': 'application/json' },
    });
  }
}

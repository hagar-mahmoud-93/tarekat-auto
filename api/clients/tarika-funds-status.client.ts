import { APIRequestContext } from '@playwright/test';
import { env } from '../../config/env';
import { SeedResult, DivisionType } from '../../pages/admin-pages/seeder.page';
import { loggedPost } from './log-request';

const AssetType = { BankAccount: 240, InvestmentAccount: 241 } as const;
const TransactionStatus = { Success: 250, Failure: 251 } as const;

export class TarikaFundsStatusClient {
  private readonly baseURL = env.admin.apiURL.replace(/\/admin$/, '');

  constructor(private readonly request: APIRequestContext) {}

  async simulate(result: SeedResult, divisionId: string, divisionType: DivisionType): Promise<void> {
    const deceasedIdNumber = result.json.deceased.identityNumber;
    const tarikaRequestNumber = divisionId;
    const both = divisionType === 'cashBankInvestmentAccounts';

    if (divisionType === 'cashBankAccounts' || both) {
      const bankAccounts = result.json.estateAssets.bankAccounts ?? [];
      if (bankAccounts.length === 0) {
        throw new Error(
          `No bank accounts found in estateAssets. Actual keys: ${Object.keys(result.json.estateAssets).join(', ')}`,
        );
      }

      // Per-asset-type production callback shape: only the matching list, no empty companion key.
      // When both asset types are present, the legacy mixed shape includes the other list as empty.
      await this.post(deceasedIdNumber, tarikaRequestNumber, {
        assetType: AssetType.BankAccount,
        listKey: 'BankAccountStatusList',
        emptyListKey: both ? 'InvestmentAccountStatusList' : undefined,
        accountList: bankAccounts.map((a) => ({
          IBAN: a.iban,
          transactionStatus: TransactionStatus.Success,
          ExchangeRate: 1.0,
          ErrorDescription: null,
          ErrorCode: null,
          Amount: parseFloat(a.balance),
        })),
        isCompleted: !both,
      });
    }

    if (divisionType === 'cashInvestmentAccounts' || both) {
      const investments = result.json.estateAssets.investments ?? [];
      if (investments.length === 0) {
        throw new Error(
          `No investment accounts found in estateAssets. Actual keys: ${Object.keys(result.json.estateAssets).join(', ')}`,
        );
      }

      await this.post(deceasedIdNumber, tarikaRequestNumber, {
        assetType: AssetType.InvestmentAccount,
        listKey: 'InvestmentAccountStatusList',
        emptyListKey: both ? 'BankAccountStatusList' : undefined,
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
      emptyListKey?: 'BankAccountStatusList' | 'InvestmentAccountStatusList';
      accountList: unknown[];
      isCompleted: boolean;
    },
  ): Promise<void> {
    const url = `${this.baseURL}/api/v1/inheritance/Transfer_Tarika_Funds_Status/`;
    const payload = {
      model: {
        idNumber: deceasedIdNumber,
        requestStatus: 1,
        TarikaRequestNumber: tarikaRequestNumber,
        assetType: args.assetType,
        [args.listKey]: args.accountList,
        ...(args.emptyListKey ? { [args.emptyListKey]: [] } : {}),
        IsCompleted: args.isCompleted,
      },
    };

    await loggedPost(this.request, 'TarikaFundsStatus', url, {
      data: payload,
      headers: { 'content-type': 'application/json' },
    });
  }
}

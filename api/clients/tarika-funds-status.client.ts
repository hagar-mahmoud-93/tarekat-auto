import { APIRequestContext } from '@playwright/test';
import { env } from '../../config/env';
import { SeedResult } from '../../pages/seeder.page';

const AssetType = { BankAccount: 240, InvestmentAccount: 241 } as const;
const TransactionStatus = { Success: 250, Failure: 251 } as const;

export class TarikaFundsStatusClient {
  private readonly baseURL = env.admin.apiURL.replace(/\/admin$/, '');

  constructor(private readonly request: APIRequestContext) {}

  async simulate(result: SeedResult, divisionId: string): Promise<void> {
    const deceasedIdNumber = result.json.deceased.identityNumber;
    const tarikaRequestNumber = divisionId;

    const bankAccounts = result.json.estateAssets.bankAccounts ?? [];
    const investmentAccounts = result.json.estateAssets.investmentAccounts ?? [];
    const hasBoth = bankAccounts.length > 0 && investmentAccounts.length > 0;

    if (bankAccounts.length === 0 && investmentAccounts.length === 0) {
      throw new Error(
        `No accounts found in estateAssets. Actual keys: ${Object.keys(result.json.estateAssets).join(', ')}`,
      );
    }

    if (bankAccounts.length > 0) {
      await this.post({
        deceasedIdNumber,
        tarikaRequestNumber,
        assetType: AssetType.BankAccount,
        accounts: bankAccounts.map((a) => ({ iban: a.iban, amount: parseFloat(a.balance) })),
        listKey: 'BankAccountStatusList',
        emptyListKey: 'InvestmentAccountStatusList',
        isCompleted: !hasBoth,
      });
    }

    if (investmentAccounts.length > 0) {
      await this.post({
        deceasedIdNumber,
        tarikaRequestNumber,
        assetType: AssetType.InvestmentAccount,
        accounts: investmentAccounts.map((a) => ({ iban: a.iban, amount: parseFloat(a.balance) })),
        listKey: 'InvestmentAccountStatusList',
        emptyListKey: 'BankAccountStatusList',
        isCompleted: true,
      });
    }
  }

  private async post(args: {
    deceasedIdNumber: string;
    tarikaRequestNumber: string;
    assetType: 240 | 241;
    accounts: { iban: string; amount: number }[];
    listKey: 'BankAccountStatusList' | 'InvestmentAccountStatusList';
    emptyListKey: 'BankAccountStatusList' | 'InvestmentAccountStatusList';
    isCompleted: boolean;
  }): Promise<void> {
    const accountList = args.accounts.map((a) => ({
      IBAN: a.iban,
      transactionStatus: TransactionStatus.Success,
      ExchangeRate: 1.0,
      ErrorDescription: null,
      ErrorCode: null,
      Amount: a.amount,
    }));

    const url = `${this.baseURL}/api/v1/inheritance/Transfer_Tarika_Funds_Status/`;
    const payload = {
      model: {
        idNumber: args.deceasedIdNumber,
        assetType: args.assetType,
        IsCompleted: args.isCompleted,
        [args.listKey]: accountList,
        [args.emptyListKey]: [],
        TarikaRequestNumber: args.tarikaRequestNumber,
        requestStatus: 1,
      },
    };

    console.log('[TarikaFundsStatus] POST', url, JSON.stringify(payload));
    const response = await this.request.post(url, {
      data: payload,
      headers: { 'content-type': 'application/json' },
    });
    console.log('[TarikaFundsStatus] Response status:', response.status());
  }
}

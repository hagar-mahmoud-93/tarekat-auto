import { APIRequestContext } from '@playwright/test';
import { env } from '../../../config/env';

const TransferStatus = { Success: 250, Failure: 251 } as const;

export type TransferFundsHeirResult = {
  idNumber: string;
  idType: number;
  name: string;
  IBAN: string;
  amount: string | number;
  status?: (typeof TransferStatus)[keyof typeof TransferStatus];
  errorCode?: string | null;
};

export class TransferFundsResultClient {
  private readonly baseURL = env.admin.apiURL.replace(/\/admin$/, '');

  constructor(private readonly request: APIRequestContext) {}

  async submitTarikaFundsResults(
    deceasedIdNumber: string,
    tarikaRequestNumber: string,
    heirs: TransferFundsHeirResult[],
  ): Promise<void> {
    const url = `${this.baseURL}/api/v1/inheritance/Transfer_Funds_result/`;
    const payload = {
      idNumber: deceasedIdNumber,
      TarikaRequestNumber: tarikaRequestNumber,
      heirs: heirs.map((h) => ({
        idNumber: h.idNumber,
        idType: h.idType,
        name: h.name,
        IBAN: h.IBAN,
        TRF_Status: h.status ?? TransferStatus.Success,
        TRF_amount: typeof h.amount === 'number' ? h.amount.toFixed(2) : h.amount,
        ErrorCode: h.errorCode ?? null,
      })),
    };

    console.log('[TransferFundsResult] POST', url, JSON.stringify(payload));
    const response = await this.request.post(url, {
      data: payload,
      headers: { 'content-type': 'application/json' },
    });
    console.log('[TransferFundsResult] Response status:', response.status());
    console.log('[TransferFundsResult] Response body:', await response.text());
  }
}

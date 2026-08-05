import { APIRequestContext, APIResponse } from '@playwright/test';
import { env } from '../../config/env';
import { loggedPost, toCurl } from './log-request';

export interface CmaHeirTransferInvestmentPortfolio {
  PortfolioNumber: string;
  ShareQuantity: string;
  CompanyName: string;
  IsTransfered: string;
  CompanyCode: string;
}

export interface CmaHeirTransferRestrictedAccount {
  AccountNumber: number;
  APNumber: string;
  PortfolioNumber: number;
  ExecutionDate: string;
}

export interface CmaHeirTransferHeir {
  /** The heir's Social ID from the "Heir Collections" table on the division dashboard (see `DivisionDashboardPage.getHeirCollections`). */
  HeirId: string;
  /** The heir's Heir Name from the "Heir Collections" table on the division dashboard (see `DivisionDashboardPage.getHeirCollections`). */
  HeirName: string;
  /** The heir's Chosen Portfolio from the "Heir Collections" table on the division dashboard (see `DivisionDashboardPage.getHeirCollections`). */
  HeirPortfolioNumber: string;
  InvestmentPortfolios: CmaHeirTransferInvestmentPortfolio[];
  RestrictedAccount?: CmaHeirTransferRestrictedAccount;
}

export interface CmaHeirTransferApReply {
  APNumber: string;
  ReplyDate: string;
  Heirs: CmaHeirTransferHeir[];
}

export interface CmaHeirTransferInquiryInvestmentAccount {
  AccountBalance: string;
  AccountNumber: string;
}

export interface CmaHeirTransferInquiryInvestmentPortfolio {
  SharesQuantity: string;
  MarketPrice: string;
  PortfolioNumber: string;
  IsLocal: string;
  CompanyName: string;
  CompanyCode: string;
}

export interface CmaHeirTransferInquiryApReply {
  APNumber: string;
  ReplyDate: string;
  InvistmentAccounts?: CmaHeirTransferInquiryInvestmentAccount[];
  InvestmentPortfolios?: CmaHeirTransferInquiryInvestmentPortfolio[];
}

export interface CmaHeirTransferInheritanceDistributionResult {
  APsReplies: CmaHeirTransferApReply[];
  ReplyDate: string;
  EdaaReply: { ReplyDate: string };
  ReplyStatus: string;
  NafithNumber: string;
  InqueryResults: { APReply: CmaHeirTransferInquiryApReply[] };
}

export class CmaHeirTransferClient {
  private readonly baseURL = env.admin.apiURL.replace(/\/admin$/, '');

  constructor(private readonly request: APIRequestContext) {}

  /**
   * @param groupedMsgId The "Grouped MsgId (CRN)" from the CMA Application section of the division
   * dashboard (see `DivisionDashboardPage.groupedMsgId`), sent as the SOAPHeader's MsgId parameter.
   */
  async submitInheritanceDistributionResult(
    result: CmaHeirTransferInheritanceDistributionResult,
    groupedMsgId: string,
  ): Promise<{ response: APIResponse; curl: string }> {
    const url = `${this.baseURL}/api/v1/callback/cma-heir-transfer`;
    const payload = {
      Envelope: {
        Header: {
          SOAPHeader: {
            SourceID: '9000',
            AuthenticationKey: 'test',
            ServiceKey: null,
            Parameters: [{ Value: groupedMsgId, Name: 'MsgId' }],
            SourceName: 'CMA',
          },
        },
        Body: {
          InheritanceDistributionResult: result,
        },
      },
    };
    const headers = {
      'content-type': 'application/json',
      authorization: `Bearer ${env.cmaHeirTransfer.accessToken}`,
    };

    const response = await loggedPost(this.request, 'CmaHeirTransfer', url, { data: payload, headers });
    const curl = toCurl('POST', url, headers, payload);

    return { response, curl };
  }
}

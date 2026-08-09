import { APIRequestContext, Page } from '@playwright/test';
import { expect } from '../fixtures/base.fixture';
import { env } from '../config/env';
import { SeederPage, SeedResult, DivisionType } from '../pages/admin-pages/seeder.page';
import { TawtheeqClient } from '../api/clients/tawtheeq.client';
import { fillMobileNumberIfPrompted } from './fill-mobile-number';

export type SeededCase = {
  result: SeedResult;
  beneficiaryTab: Page;
};

export class DataPreparation {
  constructor(
    private readonly seederPage: SeederPage,
    private readonly request: APIRequestContext,
  ) {}

  /** Seeds a case via the admin seeder, mocks it into Tawtheeq, and logs in as the beneficiary. */
  async seedCase(
    divisionType?: DivisionType,
    opts?: { minorHeirIndex?: number; deadHeirIndex?: number },
  ): Promise<SeededCase> {
    await this.seederPage.login();
    await this.seederPage.generateRandomData(divisionType);
    if (opts?.minorHeirIndex !== undefined) {
      await this.seederPage.markHeirAsMinor(opts.minorHeirIndex);
    }
    if (opts?.deadHeirIndex !== undefined) {
      await this.seederPage.markHeirAsDead(opts.deadHeirIndex);
    }
    const result = await this.seederPage.seedCase();

    const tawtheeqClient = new TawtheeqClient(this.request, env.tawtheeq.baseURL);
    const tawtheeqResponse = await tawtheeqClient.seedCase(result.json);
    expect(tawtheeqResponse.ok()).toBeTruthy();

    const beneficiaryTab = await this.seederPage.loginAsBeneficiary(result);
    return { result, beneficiaryTab };
  }
}

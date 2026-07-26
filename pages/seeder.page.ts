import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { env } from '../config/env';
import { SeederLocators } from '../locators/seeder.locators';

export type SeedCaseJson = {
  _name: string;
  deceased: Record<string, unknown>;
  beneficiary: { identityNumber: string; fullName: string; [key: string]: unknown };
  heirs: Array<{ identityNumber: string; fullName: string; [key: string]: unknown }>;
  request: { id: number; requestNumber: string };
  estateAssets: Record<string, unknown>;
};

export type SeedResult = {
  inheritanceId: string;
  heirsCount: number;
  json: SeedCaseJson;
};

export class SeederPage extends BasePage {
  private readonly locators = new SeederLocators(this.page);

  async login(username: string = env.admin.username, password: string = env.admin.password) {
    await this.page.goto(`${env.admin.apiURL}${env.inheritanceSeeder.apiURL}`);
    await this.locators.usernameInput().fill(username);
    await this.locators.passwordInput().fill(password);
    await this.locators.loginButton().click();
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  async generateRandomData() {
    await this.locators.generateRandomDataButton().click();
    // The fill is async client-side JS; give it time to populate before submitting.
    await this.page.waitForTimeout(1500);
  }

  async seedCase(): Promise<SeedResult> {
    await this.locators.seedCaseSubmit().click();
    await this.page.waitForLoadState('networkidle').catch(() => {});

    const bodyText = await this.locators.body().innerText();
    const successLine = bodyText.split('\n').find((line) => line.includes('seeded successfully'));
    if (!successLine) {
      throw new Error('Seed Case did not report success');
    }

    const inheritanceId = successLine.match(/Inheritance ID: ([\w-]+)/)?.[1] ?? '';
    const heirsCount = Number(successLine.match(/Heirs: (\d+)/)?.[1] ?? 0);

    const json = await this.page.evaluate(() => {
      const blocks = Array.from(document.querySelectorAll('pre, code'));
      for (const block of blocks) {
        const content = block.textContent?.trim() ?? '';
        if (content.startsWith('{') && content.includes('"beneficiary"')) return content;
      }
      return null;
    });
    if (!json) {
      throw new Error('Could not extract seed case JSON from the page');
    }

    return { inheritanceId, heirsCount, json: JSON.parse(json) };
  }

  async loginAsUser(identityNumber: string): Promise<Page> {
    const row = this.locators.beneficiaryRow(identityNumber);
    const loginLink = this.locators.loginAsUserLink(row);

    const [popup] = await Promise.all([
      this.page.context().waitForEvent('page'),
      loginLink.first().click(),
    ]);
    await popup.waitForLoadState('networkidle').catch(() => {});
    return popup;
  }

  async loginAsBeneficiary(result: SeedResult): Promise<Page> {
    return this.loginAsUser(result.json.beneficiary.identityNumber);
  }
}

import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { env } from '../config/env';
import { SeederLocators } from '../locators/admin-dashboard-locators/seeder.locators';

export type AssetAccount = {
  iban: string;
  accountNumber: string;
  balance: string;
};

export type InvestmentAccount = {
  accountNumber: string;
  balance: string;
};

export type SeedCaseJson = {
  _name: string;
  deceased: { identityNumber: string; [key: string]: unknown };
  beneficiary: { identityNumber: string; fullName: string; [key: string]: unknown };
  heirs: Array<{ identityNumber: string; fullName: string; [key: string]: unknown }>;
  request: { id: number; requestNumber: string };
  estateAssets: {
    bankAccounts?: AssetAccount[];
    investments?: InvestmentAccount[];
    [key: string]: unknown;
  };
};

export type SeedResult = {
  inheritanceId: string;
  heirsCount: number;
  json: SeedCaseJson;
};

/** Which cash asset types the seeded case should include. */
export type DivisionType = 'cashBankAccounts' | 'cashInvestmentAccounts' | 'cashBankInvestmentAccounts';

export class SeederPage extends BasePage {
  private readonly locators = new SeederLocators(this.page);

  async login(username: string = env.admin.username, password: string = env.admin.password) {
    await this.page.goto(`${env.admin.apiURL}${env.admin.inheritanceSeederURL}`);
    // An already-authenticated session lands straight on the seeder tool with no login form to fill.
    if (!(await this.locators.usernameInput().isVisible().catch(() => false))) return;
    await this.locators.usernameInput().fill(username);
    await this.locators.passwordInput().fill(password);
    await this.locators.loginButton().click();
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  async generateRandomData(divisionType?: DivisionType) {
    await this.page.evaluate((divisionType) => {
      const uncheck = (id: string) => {
        const cb = document.getElementById(id) as HTMLInputElement | null;
        if (cb?.checked) cb.click();
      };

      if (divisionType === 'cashInvestmentAccounts') {
        uncheck('gen_include_bank');
      } else if (divisionType == 'cashBankAccounts') {
        uncheck('gen_include_investment');
      }
    }, divisionType);
    await this.locators.generateRandomDataButton().click();
    // The fill is async client-side JS; give it time to populate before submitting.
    await this.page.waitForTimeout(1500);
  }

  /**
   * Checks the "Minor" checkbox for the heir card at the given index (0-based).
   * Index 0 is the applicant/beneficiary and is excluded from the seeded `heirs[]`
   * array, so the default targets index 1, the first heir that actually appears there.
   */
  async markHeirAsMinor(heirIndex: number = 1) {
    await this.page.evaluate((idx) => {
      const cb = document.getElementById(`heir_minor_${idx}`) as HTMLInputElement | null;
      if (cb && !cb.checked) cb.click();
    }, heirIndex);
  }

  /**
   * Checks the "Dead" checkbox for the heir card at the given index (0-based), leaving the
   * Munasakhat sub-inheritance section empty (a plain, non-munasakhat case).
   * Index 0 is the applicant/beneficiary and is excluded from the seeded `heirs[]`
   * array, so the default targets index 1, the first heir that actually appears there.
   */
  async markHeirAsDead(heirIndex: number = 1) {
    await this.page.evaluate((idx) => {
      const cb = document.getElementById(`heir_dead_${idx}`) as HTMLInputElement | null;
      if (cb && !cb.checked) cb.click();
    }, heirIndex);
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

import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { env } from '../config/env';

export class DivisionDashboardPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private heirRows() {
    return this.page.locator('table tr').filter({ has: this.page.locator('button', { hasText: '+ Mock' }) });
  }

  private addMockAccountButton(row: ReturnType<Page['locator']>) {
    return row.locator('button', { hasText: '+ Mock' });
  }

  private submitInquiryResponseButton() {
    return this.page.locator('button', { hasText: /submit inquiry response/i });
  }

  private expireAccountChoosingButton() {
    return this.page.locator('button', { hasText: /expire account choosing/i });
  }

  async expireAccountChoosing(): Promise<void> {
    await this.expireAccountChoosingButton().click();
    await this.page.waitForLoadState('networkidle').catch(() => { });
  }

  async completeHeirInqs(divisionId: string, firstHeirAccounts = 1, secondHeirAccounts = 3): Promise<void> {
    await this.page.goto(`${env.admin.apiURL}/division_v2/division/${divisionId}/dashboard/`);
    await this.page.waitForLoadState('networkidle').catch(() => { });

    const rows = this.heirRows();

    const firstRow = rows.nth(0);
    for (let i = 0; i < firstHeirAccounts; i++) {
      await this.addMockAccountButton(firstRow).click();
      await this.page.waitForLoadState('networkidle').catch(() => { });
      await this.page.waitForTimeout(1000);
    }

    await this.page.waitForTimeout(1000);

    const secondRow = rows.nth(1);
    for (let i = 0; i < secondHeirAccounts; i++) {
      await this.page.waitForTimeout(1000);
      await this.addMockAccountButton(secondRow).click();
      await this.page.waitForLoadState('networkidle').catch(() => { });
      await this.page.waitForTimeout(1000);
    }

    await this.page.waitForTimeout(1000);
    await this.submitInquiryResponseButton().click();
    await this.page.waitForLoadState('networkidle').catch(() => { });
  }
}

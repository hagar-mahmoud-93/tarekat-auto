import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { env } from '../config/env';

export class DivisionDashboardPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private heirInquiryRows() {
    return this.page.locator('table tr').filter({ has: this.page.locator('select[name^="response_"]') });
  }

  private responseSelect(row: ReturnType<Page['locator']>) {
    return row.locator('select[name^="response_"]');
  }

  private heirInquiriesTable() {
    return this.page.locator('h2', { hasText: 'Heir Inquiries' }).locator('xpath=following::table[1]');
  }

  heirInquiryFsmState(rowIndex: number) {
    return this.heirInquiriesTable().locator('tbody tr').nth(rowIndex).locator('td').nth(4);
  }

  private submitInquiryResponseButton() {
    return this.page.locator('button', { hasText: /submit inquiry response/i });
  }

  private expireAccountChoosingButton() {
    return this.page.locator('button', { hasText: /expire account choosing/i });
  }

  async expireAccountChoosing(): Promise<void> {
    this.page.once('dialog', (dialog) => dialog.accept());
    await this.expireAccountChoosingButton().click();
    await this.page.waitForLoadState('networkidle').catch(() => { });
  }

  async completeHeirInqs(divisionId: string, firstHeirAccounts = 1, secondHeirAccounts = 3): Promise<void> {
    await this.page.goto(`${env.admin.apiURL}/division_v2/division/${divisionId}/dashboard/`);
    await this.page.waitForLoadState('networkidle').catch(() => { });

    const rows = this.heirInquiryRows();

    await this.responseSelect(rows.nth(0)).selectOption({ value: `${firstHeirAccounts}_valid` });
    await this.responseSelect(rows.nth(1)).selectOption({ value: `${secondHeirAccounts}_valid` });

    this.page.once('dialog', (dialog) => dialog.accept());
    await this.submitInquiryResponseButton().click();
    await this.page.waitForLoadState('networkidle').catch(() => { });
  }
}

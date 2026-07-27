import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { env } from '../config/env';
import { TransferFundsHeirResult } from '../api/clients/transfer-funds-result.client';

type WarithOutboxEntry = { idNumber: string; idType: number; name: string; iban: string };
type WarithInboxEntry = { id: string; amount: string };

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

  private completeAllInstructionsButton() {
    return this.page.locator('button', { hasText: /complete all instructions/i });
  }

  async completeAllInstructions(): Promise<void> {
    this.page.once('dialog', (dialog) => dialog.accept());
    await this.completeAllInstructionsButton().click();
    await this.page.waitForLoadState('networkidle').catch(() => { });
  }

  async completeHeirInqs(divisionId: string, heirsCount: number): Promise<void> {
    await this.page.goto(`${env.admin.apiURL}/division_v2/division/${divisionId}/dashboard/`);
    await this.page.waitForLoadState('networkidle').catch(() => { });

    const rows = this.heirInquiryRows();

    for (let i = 0; i < heirsCount; i++) {
      const select = this.responseSelect(rows.nth(i));
      const optionValues = await select.locator('option').evaluateAll((options) =>
        options.map((option) => (option as HTMLOptionElement).value),
      );

      const validCounts = optionValues
        .map((value) => Number(value.match(/^(\d+)_valid$/)?.[1]))
        .filter((count): count is number => !Number.isNaN(count));

      if (validCounts.length === 0) {
        throw new Error(`No "_valid" option found for heir inquiry row ${i}`);
      }

      await select.selectOption({ value: `${Math.max(...validCounts)}_valid` });
    }

    this.page.once('dialog', (dialog) => dialog.accept());
    await this.submitInquiryResponseButton().click();
    await this.page.waitForLoadState('networkidle').catch(() => { });
  }

  /**
   * Reads the heir id/IBAN/name from the "ejada.warith_update" outbox request payload
   * and the per-heir amount from the "distribution_requested" inbox result, merging them
   * by idNumber into the shape Transfer_Funds_result expects.
   */
  async getWarithHeirs(divisionId: string): Promise<TransferFundsHeirResult[]> {
    await this.page.goto(`${env.admin.apiURL}/division_v2/division/${divisionId}/dashboard/`);
    await this.page.waitForLoadState('networkidle').catch(() => { });

    const raw = await this.page.evaluate(() => {
      const preTextBySummary = (row: Element, summaryText: string): string | null => {
        const details = Array.from(row.querySelectorAll('details')).find(
          (d) => d.querySelector('summary')?.textContent?.trim() === summaryText,
        );
        return details?.querySelector('pre')?.textContent ?? null;
      };

      const rows = Array.from(document.querySelectorAll('table tr'));
      const outboxRow = rows.find((row) => row.textContent?.includes('ejada.warith_update'));
      const inboxRow = rows.find((row) => row.textContent?.includes('distribution_requested'));

      return {
        outboxPayload: outboxRow ? preTextBySummary(outboxRow, 'Request payload') : null,
        inboxResult: inboxRow ? preTextBySummary(inboxRow, 'Result') : null,
      };
    });

    if (!raw.outboxPayload) {
      throw new Error('Could not find "ejada.warith_update" outbox entry request payload');
    }
    if (!raw.inboxResult) {
      throw new Error('Could not find "distribution_requested" inbox entry result');
    }

    const outbox: { WarithList: WarithOutboxEntry[] } = JSON.parse(raw.outboxPayload);
    const inbox: { WarithList: WarithInboxEntry[] } = JSON.parse(raw.inboxResult);

    return outbox.WarithList.map((heir) => {
      const amountEntry = inbox.WarithList.find((entry) => entry.id === heir.idNumber);
      if (!amountEntry) {
        throw new Error(`No distribution amount found for heir ${heir.idNumber}`);
      }

      return {
        idNumber: heir.idNumber,
        idType: heir.idType,
        name: heir.name,
        IBAN: heir.iban,
        amount: amountEntry.amount,
      };
    });
  }
}

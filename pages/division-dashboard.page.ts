import { Page } from '@playwright/test';
import { expect } from '../fixtures/base.fixture';
import { BasePage } from './base.page';
import { env } from '../config/env';
import { TransferFundsHeirResult } from '../api/clients/cashDivisionAPIs/transfer-funds-result.client';

type WarithDistributionEntry = { idNumber: string; idType: number; name: string; iban: string; amount: string };

export class DivisionDashboardPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async open(divisionId: string): Promise<void> {
    await this.page.goto(`${env.admin.apiURL}/division_v2/division/${divisionId}/dashboard/`);
    await this.page.waitForLoadState('networkidle').catch(() => { });
  }

  private summaryCard(label: string) {
    return this.page
      .locator('.summary-banner .summary-card')
      .filter({ has: this.page.locator('label', { hasText: label }) });
  }

  divisionStatus() {
    return this.summaryCard('Status').locator('.status-badge');
  }

  ejadaStage() {
    return this.summaryCard('Ejada Stage').locator('.status-badge');
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

  private outboxEntriesTable() {
    return this.page.locator('h2', { hasText: 'Outbox Entries' }).locator('xpath=following::table[1]');
  }

  private outboxEntryRow(apiName: string) {
    return this.outboxEntriesTable()
      .locator('tbody tr')
      .filter({ has: this.page.locator('td', { hasText: apiName }) });
  }

  /** Clicks the "Simulate Success" QA action for the Outbox Entries row matching the given API name. */
  async simulateOutboxSuccess(apiName: string): Promise<void> {
    this.page.once('dialog', (dialog) => dialog.accept());
    await this.outboxEntryRow(apiName).getByRole('button', { name: 'Simulate Success' }).click();
    await this.page.waitForLoadState('networkidle').catch(() => { });
  }

  private expirePortfolioCollectionButton() {
    return this.page.locator('button', { hasText: /expire portfolio collection/i });
  }

  async expirePortfolioCollection(): Promise<void> {
    this.page.once('dialog', (dialog) => dialog.accept());
    await this.expirePortfolioCollectionButton().click();
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
    await this.open(divisionId);

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

  private cmaApplicationEditLink() {
    return this.page.locator('h2', { hasText: 'CMA Application' }).locator('a.edit-link');
  }

  async openCmaApplicationEdit(): Promise<void> {
    await this.cmaApplicationEditLink().click();
    await this.page.waitForLoadState('networkidle').catch(() => { });
  }

  private cmaApplicationMetaItem(label: string) {
    return this.page
      .locator('h2', { hasText: 'CMA Application' })
      .locator('xpath=following-sibling::div[contains(@class,"meta-grid")][1]')
      .locator('.meta-item')
      .filter({ has: this.page.locator('label', { hasText: label }) });
  }

  /** The "Grouped Nafith # (SRN)" value in the CMA Application section. */
  groupedNafithNumber() {
    return this.cmaApplicationMetaItem('Grouped Nafith').locator('.value');
  }

  /** The "Grouped MsgId (CRN)" value in the CMA Application section — the MsgId used by the cma-heir-transfer callback. */
  groupedMsgId() {
    return this.cmaApplicationMetaItem('Grouped MsgId').locator('.value');
  }

  private heirCollectionsTable() {
    return this.page.locator('h3', { hasText: 'Heir Collections' }).locator('xpath=following::table[1]');
  }

  private async heirCollectionsColumnIndex(headerLabel: string): Promise<number> {
    const headers = await this.heirCollectionsTable().locator('thead th').allInnerTexts();
    const index = headers.findIndex((header) => header.trim().toUpperCase() === headerLabel.toUpperCase());
    if (index === -1) {
      throw new Error(`Column "${headerLabel}" not found in Heir Collections table. Headers: ${headers.join(', ')}`);
    }

    return index;
  }

  /**
   * Reads the "Social ID", "Heir Name" and "Chosen Portfolio" columns from the "Heir Collections"
   * table, in row order — used as the cma-heir-transfer HeirId, HeirName and HeirPortfolioNumber
   * for each heir.
   */
  async getHeirCollections(): Promise<{ socialId: string; heirName: string; chosenPortfolio: string }[]> {
    const table = this.heirCollectionsTable();
    const headerCount = await table.locator('thead th').count();

    const [socialIdColumn, heirNameColumn, chosenPortfolioColumn] = await Promise.all([
      this.heirCollectionsColumnIndex('Social ID'),
      this.heirCollectionsColumnIndex('Heir Name'),
      this.heirCollectionsColumnIndex('Chosen Portfolio'),
    ]);

    const rows = table.locator('tbody tr');
    const rowCount = await rows.count();

    const entries: { socialId: string; heirName: string; chosenPortfolio: string }[] = [];
    for (let i = 0; i < rowCount; i++) {
      const row = rows.nth(i);
      const cells = row.locator('td');
      const cellCount = await cells.count();
      // Each heir row is followed by a collapsible "Attempts" detail row rendered as a single
      // full-width cell — skip anything that isn't a full data row instead of treating it as
      // malformed.
      if (cellCount !== headerCount) continue;

      const [socialId, heirName, chosenPortfolio] = await Promise.all([
        cells.nth(socialIdColumn).innerText(),
        cells.nth(heirNameColumn).innerText(),
        cells.nth(chosenPortfolioColumn).innerText(),
      ]);
      entries.push({ socialId: socialId.trim(), heirName: heirName.trim(), chosenPortfolio: chosenPortfolio.trim() });
    }

    return entries;
  }

  private warithDistributionsTable() {
    return this.page.locator('h3', { hasText: 'Warith Distributions' }).locator('xpath=following::table[1]');
  }

  /** Reads the heir id/IBAN/name/amount from the currently loaded "Warith Distributions" table. */
  private async readWarithDistributions(): Promise<WarithDistributionEntry[]> {
    const rows = this.warithDistributionsTable().locator('tbody tr');
    const rowCount = await rows.count();

    const entries: WarithDistributionEntry[] = [];
    for (let i = 0; i < rowCount; i++) {
      const cells = rows.nth(i).locator('td');
      const [name, idNumber, iban, amount] = await Promise.all([
        cells.nth(1).innerText(),
        cells.nth(2).innerText(),
        cells.nth(3).innerText(),
        cells.nth(4).innerText(),
      ]);
      entries.push({ idNumber: idNumber.trim(), idType: 1, name: name.trim(), iban: iban.trim(), amount: amount.trim() });
    }

    return entries;
  }

  /**
   * Reads the heir id/IBAN/name/amount from the "Warith Distributions" table, which is scoped
   * to this division (unlike the Outbox/Inbox message tables, which can retain unrelated entries
   * from other divisions/runs).
   *
   * Loads the dashboard once, then polls that same DOM snapshot until every heir has a row with
   * a numeric amount, without reloading the page on each retry.
   */
  async getWarithHeirs(divisionId: string, heirsCount: number): Promise<TransferFundsHeirResult[]> {
    await this.open(divisionId);

    let entries: WarithDistributionEntry[] = [];

    await expect(async () => {
      entries = await this.readWarithDistributions();
      const pending = entries.filter((entry) => Number.isNaN(parseFloat(entry.amount)));
      expect(entries, 'still awaiting warith distribution rows').toHaveLength(heirsCount);
      expect(pending, `still awaiting distribution amounts for: ${pending.map((e) => e.idNumber).join(', ')}`).toHaveLength(0);
    }).toPass({ timeout: 90_000 });

    return entries.map((entry) => ({
      idNumber: entry.idNumber,
      idType: entry.idType,
      name: entry.name,
      IBAN: entry.iban,
      amount: parseFloat(entry.amount).toFixed(2),
    }));
  }
}

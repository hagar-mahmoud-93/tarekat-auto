import { Locator, Page } from '@playwright/test';

export class SeederLocators {
  constructor(private readonly page: Page) {}

  usernameInput() {
    return this.page.getByLabel('Username:');
  }

  passwordInput() {
    return this.page.getByLabel('Password:');
  }

  loginButton() {
    return this.page.getByRole('button', { name: 'Log in' });
  }

  generateRandomDataButton() {
    return this.page.getByRole('button', { name: 'Generate Random Data' });
  }

  includeInvestmentCheckbox() {
    return this.page.locator('#gen_include_investment');
  }

  seedCaseSubmit() {
    return this.page.locator('input[type=submit][value="Seed Case"]');
  }

  body() {
    return this.page.locator('body');
  }

  /** The admin table row for the beneficiary with the given identity number. */
  beneficiaryRow(identityNumber: string) {
    return this.page.locator('tr', { hasText: identityNumber });
  }

  loginAsUserLink(row: Locator) {
    return row.first().locator('a, button').filter({ hasText: /Login as User/i });
  }
}

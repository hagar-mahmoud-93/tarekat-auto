import { Page } from '@playwright/test';

export class AdminSettingsLocators {
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

  valueInput() {
    return this.page.locator('#id_value');
  }

  saveButton() {
    return this.page.locator('input[type=submit][value="Save"]');
  }
}

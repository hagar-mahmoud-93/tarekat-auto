import { Page } from '@playwright/test';

export class AdminLoginLocators {
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
}

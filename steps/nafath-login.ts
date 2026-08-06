import { Page } from '@playwright/test';
import { expect } from '../fixtures/base.fixture';
import { LoginPage } from '../pages/login.page';

/** Logs in via Nafath with the given credentials and verifies navigation away from /login. */
export async function nafathLogin(page: Page, loginPage: LoginPage, username: string, password: string): Promise<void> {
  await loginPage.goto();
  await loginPage.loginWithNafath(username, password);

  await expect(page).not.toHaveURL(/\/login/);
}

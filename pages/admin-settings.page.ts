import { BasePage } from './base.page';
import { env } from '../config/env';
import { AdminSettingsLocators } from '../locators/admin-settings.locators';

export class AdminSettingsPage extends BasePage {
  private readonly locators = new AdminSettingsLocators(this.page);

  async open() {
    await this.page.goto(`${env.admin.apiURL}${env.admin.settingsURL}`);
    // An unauthenticated session lands on the standard Django admin login form first.
    if (await this.locators.usernameInput().isVisible().catch(() => false)) {
      await this.locators.usernameInput().fill(env.admin.username);
      await this.locators.passwordInput().fill(env.admin.password);
      await this.locators.loginButton().click();
    }
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  async disableValue() {
    await this.locators.valueInput().fill('False');
    await this.locators.saveButton().click();
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }
}
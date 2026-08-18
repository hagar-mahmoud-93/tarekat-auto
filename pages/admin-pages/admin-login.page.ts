import { BasePage } from '../base.page';
import { env } from '../../config/env';
import { AdminLoginLocators } from '../../locators/admin-dashboard-locators/admin-login.locators';

export class AdminLoginPage extends BasePage {
  private readonly locators = new AdminLoginLocators(this.page);

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
}

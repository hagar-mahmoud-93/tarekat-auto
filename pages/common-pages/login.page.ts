import { BasePage } from '../base.page';
import { LoginLocators } from '../../locators/common-locators/login.locators';

export class LoginPage extends BasePage {
  private readonly locators = new LoginLocators(this.page);

  async goto() {
    await this.page.goto('/login');
  }

  async loginWithNafath(username: string, password: string) {
    await this.locators.nafathLoginLink().click();
    await this.locators.usernameInput().fill(username);
    await this.locators.passwordInput().fill(password);
    await this.locators.submitButton().click();
  }
}

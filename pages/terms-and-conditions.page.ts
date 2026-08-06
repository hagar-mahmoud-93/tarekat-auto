import { BasePage } from './base.page';
import { TermsAndConditionsLocators } from '../locators/terms-and-conditions.locators';

export class TermsAndConditionsPage extends BasePage {
  private readonly locators = new TermsAndConditionsLocators(this.page);

  async agree() {
    await this.locators.agreeButton().click();
  }
}

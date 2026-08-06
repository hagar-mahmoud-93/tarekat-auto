import { BasePage } from '../base.page';
import { WizardNavLocators } from '../../locators/heirs-determination-locators/wizard-nav.locators';

export class WizardNavPage extends BasePage {
  private readonly locators = new WizardNavLocators(this.page);

  async saveAndContinue() {
    await this.locators.saveAndContinueButton().click();
  }
}

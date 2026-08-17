import { BasePage } from '../base.page';
import { TermsAndConditionsLocators } from '../../locators/heirs-determination-locators/terms-and-conditions.locators';
import { waitForLoadingOverlayToDisappear } from '../../steps/wait-for-loading-overlay';

export class TermsAndConditionsPage extends BasePage {
  private readonly locators = new TermsAndConditionsLocators(this.page);

  /** Advancing to بيانات مقدم الطلب can show the wizard's transitional loading overlay, same as
   *  other step-advancing actions in this flow (see MainMenuPage.openMyOrders,
   *  HeirsListPage.acknowledgeHeirsList) - wait it out before returning. */
  async agree() {
    await this.locators.agreeButton().click();
    await waitForLoadingOverlayToDisappear(this.page);
  }
}

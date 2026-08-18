import { BasePage } from '../base.page';
import { HeirsListLocators } from '../../locators/heirs-determination-locators/heirs-list.locators';
import { waitForLoadingOverlayToDisappear } from '../../steps/wait-for-loading-overlay';

export class HeirsListPage extends BasePage {
  private readonly locators = new HeirsListLocators(this.page);

  /**
   * Checks أقرُّ بصحة قائمة الورثة واشتمالها على جميع الورثة; حفظ ومتابعة stays disabled until this is
   * checked. The step's loading overlay can still cover the checkbox when it first becomes visible, so
   * the click silently lands on the overlay instead unless we wait it out first.
   */
  async acknowledgeHeirsList() {
    await waitForLoadingOverlayToDisappear(this.page);
    await this.locators.acknowledgeCheckbox().click({ force: true });
  }
}

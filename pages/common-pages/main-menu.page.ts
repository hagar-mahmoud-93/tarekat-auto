import { BasePage } from '../base.page';
import { MainMenuLocators } from '../../locators/common-locators/main-menu.locators';
import { waitForLoadingOverlayToDisappear } from '../../steps/wait-for-loading-overlay';

export class MainMenuPage extends BasePage {
  private readonly locators = new MainMenuLocators(this.page);

  async openOnlineServices() {
    await this.locators.onlineServicesItem().click();
  }

  async openMyOrders() {
    await this.locators.myOrdersItem().click();
    await waitForLoadingOverlayToDisappear(this.page);
  }
}

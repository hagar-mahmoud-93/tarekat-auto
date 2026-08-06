import { BasePage } from './base.page';
import { MainNavLocators } from '../locators/main-nav.locators';

export class MainNavPage extends BasePage {
  private readonly locators = new MainNavLocators(this.page);

  async openOnlineServices() {
    await this.locators.onlineServicesItem().click();
  }

  async openMyOrders() {
    await this.locators.myOrdersItem().click();
  }
}

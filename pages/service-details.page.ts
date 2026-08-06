import { BasePage } from './base.page';
import { ServiceDetailsLocators } from '../locators/service-details.locators';

export class ServiceDetailsPage extends BasePage {
  private readonly locators = new ServiceDetailsLocators(this.page);

  async startService() {
    await this.locators.startServiceButton().click();
  }
}

import { BasePage } from './base.page';
import { OnlineServicesLocators } from '../locators/online-services.locators';

export class OnlineServicesPage extends BasePage {
  private readonly locators = new OnlineServicesLocators(this.page);

  /** Opens a service card's details, e.g. viewServiceDetails('إصدار حصر الورثة'). */
  async viewServiceDetails(cardHeading: string) {
    await this.locators.viewServiceDetailsButton(cardHeading).click();
  }
}

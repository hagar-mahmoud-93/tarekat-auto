import { BasePage } from './base.page';
import { ServiceSelectionLocators } from '../locators/service-selection.locators';

export class ServiceSelectionPage extends BasePage {
  private readonly locators = new ServiceSelectionLocators(this.page);

  /** Opens a service-selection card, e.g. selectCard('إصدار وثيقة حصر ورثة جديدة'). */
  async selectCard(cardTitle: string) {
    await this.locators.cardArrowButton(cardTitle).click();
  }
}

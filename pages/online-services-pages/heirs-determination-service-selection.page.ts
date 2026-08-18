import { BasePage } from '../base.page';
import { HeirsDeterminationServiceSelectionLocators } from '../../locators/online-services-locators/heirs-determination-service-selection.locators';

export class HeirsDeterminationServiceSelectionPage extends BasePage {
  private readonly locators = new HeirsDeterminationServiceSelectionLocators(this.page);

  /** Opens a service-selection card, e.g. selectCard('إصدار وثيقة حصر ورثة جديدة'). */
  async selectCard(cardTitle: string) {
    await this.locators.cardArrowButton(cardTitle).click();
  }
}

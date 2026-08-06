import { BasePage } from './base.page';
import { MyOrdersLocators } from '../locators/my-orders.locators';

export class MyOrdersPage extends BasePage {
  private readonly locators = new MyOrdersLocators(this.page);

  async search(query: string) {
    await this.locators.searchInput().fill(query);
    await this.locators.searchLoadingSpinner().waitFor({ state: 'hidden' });
  }

  /** The رقم الطلب value in a result card matching the given request number. */
  requestNumberResult(requestNumber: string) {
    return this.locators.requestNumberText(requestNumber);
  }
}

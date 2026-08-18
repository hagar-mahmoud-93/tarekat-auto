import { BasePage } from '../base.page';
import { MyOrdersLocators } from '../../locators/common-locators/my-orders.locators';

export class MyOrdersPage extends BasePage {
  private readonly locators = new MyOrdersLocators(this.page);

  /**
   * Fills البحث and waits out the search request. The search is debounced ~1s after the fill, so
   * the spinner isn't visible yet right after filling — waiting for "hidden" without first
   * confirming it appeared would resolve immediately, before the debounced request is even sent.
   */
  async search(query: string) {
    await this.locators.searchInput().fill(query);

    const spinner = this.locators.searchLoadingSpinner();
    const appeared = await spinner
      .waitFor({ state: 'visible', timeout: 3000 })
      .then(() => true)
      .catch(() => false);
    if (appeared) {
      await spinner.waitFor({ state: 'hidden', timeout: 15000 });
    }
  }

  /** The رقم الطلب value in a result card matching the given request number. */
  requestNumberResult(requestNumber: string) {
    return this.locators.requestNumberText(requestNumber);
  }

  /** The رقم هوية المورّث value in the deceased summary card atop a matched حصر الورثة request. */
  deceasedIdentityNumber() {
    return this.locators.deceasedIdentityNumber();
  }

  /** The حالة الطلب value for the order card matching the given نوع الطلب, e.g. 'حصر الورثة'. */
  orderStatus(requestType: string) {
    return this.locators.orderStatus(requestType);
  }
}

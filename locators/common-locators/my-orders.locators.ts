import { Page } from '@playwright/test';

export class MyOrdersLocators {
  constructor(private readonly page: Page) {}

  searchInput() {
    return this.page.getByPlaceholder('البحث');
  }

  searchLoadingSpinner() {
    return this.page.locator('.p-progress-spinner');
  }

  /**
   * The رقم الطلب value in a result card matching the given request number. The same number is
   * shared by the paired حصر الورثة/حصر التركة cards, so this matches the first occurrence.
   */
  requestNumberText(requestNumber: string) {
    return this.page.getByText(requestNumber, { exact: true }).first();
  }

  /** The رقم هوية المورّث value in the deceased summary card atop a matched حصر الورثة request. */
  deceasedIdentityNumber() {
    return this.page.getByRole('heading', { name: 'رقم هوية المورّث' }).locator('xpath=../p');
  }

  /**
   * The order card whose نوع الطلب matches the given type, e.g. 'حصر الورثة'. The same رقم الطلب
   * is shared by paired cards (حصر الورثة/حصر التركة/قسمة التركة), so this scopes to the right one.
   */
  orderCard(requestType: string) {
    return this.page.locator('div.grid').filter({ has: this.page.getByText(requestType, { exact: true }) });
  }

  /** The حالة الطلب badge value within the order card matching the given نوع الطلب. */
  orderStatus(requestType: string) {
    return this.orderCard(requestType).getByRole('heading', { name: 'حالة الطلب' }).locator('xpath=..').getByRole('paragraph');
  }
}

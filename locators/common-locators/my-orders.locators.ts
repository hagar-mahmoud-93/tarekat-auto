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
}

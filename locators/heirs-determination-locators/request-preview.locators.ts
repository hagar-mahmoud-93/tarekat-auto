import { Page } from '@playwright/test';

export class RequestPreviewLocators {
  constructor(private readonly page: Page) {}

  closePopupIcon() {
    return this.page.locator('.icon-close-for-popup');
  }

  /** The "تم تقديم طلب حصر الورثة رقم: {requestNumber} بنجاح" success confirmation. */
  successConfirmation() {
    return this.page.getByText(/تم تقديم طلب حصر الورثة رقم/);
  }

  viewRequestDetailsButton() {
    return this.page.getByRole('button', { name: 'عرض تفاصيل الطلب' });
  }
}

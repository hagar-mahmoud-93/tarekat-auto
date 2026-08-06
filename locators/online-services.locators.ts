import { Page } from '@playwright/test';

export class OnlineServicesLocators {
  constructor(private readonly page: Page) {}

  private cardBody(heading: string) {
    return this.page.locator('.p-card-body').filter({ hasText: heading });
  }

  /** A card's "تصفح تفاصيل الخدمة" button; the label is a plain div, so the click target is its parent. */
  viewServiceDetailsButton(heading: string) {
    return this.cardBody(heading).getByText('تصفح تفاصيل الخدمة', { exact: true }).locator('xpath=..');
  }
}

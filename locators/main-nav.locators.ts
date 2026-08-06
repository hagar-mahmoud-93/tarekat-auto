import { Page } from '@playwright/test';

export class MainNavLocators {
  constructor(private readonly page: Page) {}

  /** The sidebar's "الخدمات الإلكترونية" item; the label is a plain div, so the click target is its parent. */
  onlineServicesItem() {
    return this.page.getByText('الخدمات الإلكترونية', { exact: true }).locator('xpath=..');
  }

  /** The sidebar's "الطلبات" item; the label is a plain div, so the click target is its parent. */
  myOrdersItem() {
    return this.page.getByText('الطلبات', { exact: true }).first().locator('xpath=..');
  }
}

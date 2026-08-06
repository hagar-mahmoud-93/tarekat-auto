import { Page } from '@playwright/test';

export class HeirsListLocators {
  constructor(private readonly page: Page) {}

  /** أقرُّ بصحة قائمة الورثة checkbox; its visual box covers the input, so the click is forced. */
  acknowledgeCheckbox() {
    return this.page.locator('input[type="checkbox"].p-checkbox-input');
  }
}

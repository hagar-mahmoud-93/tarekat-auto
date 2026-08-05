import { Page } from '@playwright/test';

export class AdminIsMockDisabledLocators {
  constructor(private readonly page: Page) {}

  valueInput() {
    return this.page.locator('#id_value');
  }

  saveButton() {
    return this.page.locator('input[type=submit][value="Save"]');
  }
}

import { Page } from '@playwright/test';

export class CmaApplicationLocators {
  constructor(private readonly page: Page) {}

  groupedNafithNumberInput() {
    return this.page.locator('#id_grouped_nafith_number');
  }

  saveButton() {
    return this.page.locator('input[name="_save"]');
  }
}

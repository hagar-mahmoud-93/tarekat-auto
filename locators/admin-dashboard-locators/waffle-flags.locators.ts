import { Page } from '@playwright/test';

export class WaffleFlagsLocators {
  constructor(private readonly page: Page) {}

  flagLink(name: string) {
    return this.page.locator('#result_list').getByRole('link', { name, exact: true });
  }

  nameInput() {
    return this.page.locator('#id_name');
  }

  everyoneSelect() {
    return this.page.locator('#id_everyone');
  }

  saveButton() {
    return this.page.locator('input[type=submit][value="Save"]');
  }
}

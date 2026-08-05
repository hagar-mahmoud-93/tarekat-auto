import { Page } from '@playwright/test';

export class ConfigurationsServiceLocators {
  constructor(private readonly page: Page) {}

  showAllLink() {
    return this.page.getByRole('link', { name: 'Show all' });
  }

  isMockActiveCheckboxes() {
    return this.page.locator('.field-is_mock_active input[type=checkbox]');
  }

  /** The native checkboxes are `display: none`; this label is the actual toggle to click. */
  isMockActiveLabels() {
    return this.page.locator('.field-is_mock_active label');
  }

  saveButton() {
    return this.page.locator('input[type=submit][value="Save"]');
  }
}

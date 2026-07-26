import { Page } from '@playwright/test';

export class DivisionAdminLocators {
  constructor(private readonly page: Page) {}

  searchInput() {
    return this.page.locator('#searchbar');
  }

  searchButton() {
    return this.page.locator('input[type=submit][value=Search]');
  }

  /** The first row in the filtered results list. */
  resultRow() {
    return this.page.locator('#result_list tbody tr').first();
  }

  dashboardLink() {
    return this.resultRow().locator('a, button').filter({ hasText: /dashboard/i });
  }
}

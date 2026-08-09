import { Page } from '@playwright/test';

export class ServiceDetailsLocators {
  constructor(private readonly page: Page) {}

  startServiceButton() {
    return this.page.getByRole('button', { name: 'بدء الخدمة' });
  }
}

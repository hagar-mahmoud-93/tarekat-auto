import { Page } from '@playwright/test';

export class TermsAndConditionsLocators {
  constructor(private readonly page: Page) {}

  agreeButton() {
    return this.page.getByRole('button', { name: 'موافق', exact: true });
  }

  disagreeButton() {
    return this.page.getByRole('button', { name: 'غير موافق', exact: true });
  }
}

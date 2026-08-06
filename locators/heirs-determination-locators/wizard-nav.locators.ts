import { Page } from '@playwright/test';

/** Footer navigation shared across all طلب حصر ورثة wizard steps. */
export class WizardNavLocators {
  constructor(private readonly page: Page) {}

  saveAndContinueButton() {
    return this.page.getByRole('button', { name: 'حفظ ومتابعة' });
  }

  backButton() {
    return this.page.getByRole('button', { name: 'العودة' });
  }

  cancelButton() {
    return this.page.getByRole('button', { name: 'إلغاء' });
  }
}

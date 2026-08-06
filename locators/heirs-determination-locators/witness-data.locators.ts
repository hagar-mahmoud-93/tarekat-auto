import { Page } from '@playwright/test';

export class WitnessDataLocators {
  constructor(private readonly page: Page) {}

  relationToDeceasedDropdown() {
    return this.page.locator('#relationToInheritor');
  }

  relationToDeceasedOptions() {
    return this.page.getByRole('option');
  }

  mobileNumberInput() {
    return this.page.locator('#mobileNumber');
  }

  idTypeDropdown() {
    return this.page.locator('#idType');
  }

  idTypeOption(name: string) {
    return this.page.getByRole('option', { name });
  }

  idNumberInput() {
    return this.page.getByPlaceholder('رقم الهوية');
  }

  /** تاريخ الميلاد input; defaults to هجري, matching the seeded witness birthDateHijri format. */
  birthDateInput() {
    return this.page.getByPlaceholder('تاريخ الميلاد');
  }
}

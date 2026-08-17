import { Page } from '@playwright/test';

export class WitnessDataLocators {
  constructor(private readonly page: Page) {}

  relationToDeceasedDropdown() {
    return this.page.locator('#relationToInheritor');
  }

  relationToDeceasedOptions() {
    return this.page.getByRole('option');
  }

  /** The panel's own filter input (PrimeVue dropdown) - selecting an option doesn't synchronously
   *  close the panel, so this is used to wait for it to actually disappear rather than assuming
   *  a fixed action (e.g. Escape) closed it. */
  relationToDeceasedFilterInput() {
    return this.page.locator('input[aria-owns="relationToInheritor_list"]');
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

  /** Placeholder switches to رقم الإقامة when نوع الهوية is إقامة, so both are matched. */
  idNumberInput() {
    return this.page.getByPlaceholder(/^(رقم الهوية|رقم الإقامة)$/);
  }

  /** تاريخ الميلاد input; defaults to هجري, matching the seeded witness birthDateHijri format. */
  birthDateInput() {
    return this.page.getByPlaceholder('تاريخ الميلاد');
  }

  /** Validates the entered صلة قرابة/رقم الجوال/نوع الهوية/رقم الهوية/تاريخ الميلاد against each other. */
  verifyButton() {
    return this.page.getByRole('button', { name: 'تحقق', exact: true });
  }
}

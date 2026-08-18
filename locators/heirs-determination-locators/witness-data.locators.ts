import { Page } from '@playwright/test';

export class WitnessDataLocators {
  constructor(private readonly page: Page) {}

  relationToDeceasedDropdown() {
    return this.page.locator('#relationToInheritor');
  }

  /** Scoped to real option items with an id (relationToInheritor_0, _1, ...), excluding the
   *  panel's "لا يوجد بيانات" empty-state placeholder - it's also marked role="option" and renders
   *  immediately on open, before the ~90 real options finish loading asynchronously, so an
   *  unscoped getByRole('option') can match and click it instead of a real option. */
  relationToDeceasedOptions() {
    return this.page.locator('#relationToInheritor_list li[id^="relationToInheritor_"]');
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

  /** Generic PrimeVue dropdown panel class (shared with صلة قرابة الشاهد بالمورث's panel) - idType
   *  has no filter input to key a more specific locator off of, but by the time this is checked
   *  that other panel is already closed, so this only ever matches idType's. */
  idTypeDropdownPanel() {
    return this.page.locator('.p-dropdown-panel');
  }

  /** Placeholder switches to رقم الإقامة when نوع الهوية is إقامة, so both are matched. */
  idNumberInput() {
    return this.page.getByPlaceholder(/^(رقم الهوية|رقم الإقامة)$/);
  }

  /** تاريخ الميلاد input; defaults to هجري, matching the seeded witness birthDateHijri format. */
  birthDateInput() {
    return this.page.getByPlaceholder('تاريخ الميلاد');
  }

  /** The تاريخ الميلاد calendar popup opened by filling birthDateInput() - selecting a date (or
   *  filling the input directly) doesn't synchronously close it. */
  birthDateCalendarPanel() {
    return this.page.getByRole('dialog', { name: 'Choose Date' });
  }

  /** Validates the entered صلة قرابة/رقم الجوال/نوع الهوية/رقم الهوية/تاريخ الميلاد against each other. */
  verifyButton() {
    return this.page.getByRole('button', { name: 'تحقق', exact: true });
  }
}

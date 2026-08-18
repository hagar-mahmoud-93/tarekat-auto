import { Page } from '@playwright/test';

export class DeceasedDataLocators {
  constructor(private readonly page: Page) {}

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

  /** تاريخ الميلاد input; defaults to هجري, matching the seeded deceased.birthDateHijri format. */
  birthDateInput() {
    return this.page.getByPlaceholder('تاريخ الميلاد');
  }

  /** The two file inputs share id/name "fileUploader", so they're matched by DOM order: صورة سجل الاسرة, then صورة شهادة الوفاة. */
  familyRegisterFileInput() {
    return this.page.locator('input[type="file"]').nth(0);
  }

  deathCertificateFileInput() {
    return this.page.locator('input[type="file"]').nth(1);
  }

  /** Validates the entered رقم الهوية/نوع الهوية/تاريخ الميلاد against each other. */
  verifyButton() {
    return this.page.getByRole('button', { name: 'تحقق', exact: true });
  }

  /** إضافة صلة قرابة مع المورث dropdown, shown after تحقق; disabled when the system auto-detects the relationship. */
  relationshipDropdown() {
    return this.page.locator('#relationToInheritor');
  }

  relationshipOption(name: string) {
    return this.page.getByRole('option', { name, exact: true });
  }
}

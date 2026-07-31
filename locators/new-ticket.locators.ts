import { Page } from '@playwright/test';

export class NewTicketLocators {
  constructor(private readonly page: Page) {}

  /** The disabled "اسم مقدم التذكرة" field, auto-filled once verify-applicant succeeds. */
  applicantNameInput() {
    return this.page.locator('div').filter({ hasText: 'اسم مقدم التذكرة' }).last().getByRole('textbox');
  }

  mobileNumberInput() {
    return this.page.getByRole('textbox', { name: 'رقم الجوال' });
  }

  ticketTypeRadio(type: 'شكوى' | 'طلب') {
    return this.page.getByRole('radio', { name: type });
  }

  mainCategoryCombobox() {
    return this.page.locator('div').filter({ hasText: 'التصنيف الرئيسي' }).last().getByRole('combobox');
  }

  subCategoryCombobox() {
    return this.page.locator('div').filter({ hasText: 'التصنيف الفرعي' }).last().getByRole('combobox');
  }

  categoryOption(name: string) {
    return this.page.getByRole('option', { name });
  }

  detailsTextbox() {
    return this.page.getByRole('textbox', { name: 'ادخل تفاصيل المشكلة' });
  }

  /** The "حفظ ومتابعة" button used in steps 1 and 2 to advance to the next step. */
  saveAndContinueButton() {
    return this.page.getByRole('button', { name: 'حفظ ومتابعة' });
  }

  /** The "تقديم التذكرة" button on the step 3 review page (opens the confirmation dialog). */
  submitTicketButton() {
    return this.page.getByRole('button', { name: 'تقديم التذكرة', exact: true });
  }

  /** The "هل انت متاكد من تقديم التذكرة؟" confirmation dialog's submit button. */
  confirmSubmitButton() {
    return this.page.getByRole('dialog').filter({ hasText: 'هل انت متاكد من تقديم التذكرة؟' }).getByRole('button', { name: 'تقديم التذكرة' });
  }

  /** The "تم تقديم رقم التذكرة '...' بنجاح" success dialog. */
  successDialog() {
    return this.page.getByRole('dialog').filter({ hasText: 'تم تقديم رقم التذكرة' });
  }
}

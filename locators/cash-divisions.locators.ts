import { Page } from '@playwright/test';

export class CashDivisionsLocators {
  constructor(private readonly page: Page) {}

  /** The "الأموال النقدية" card. */
  cashCard() {
    return this.page.getByRole('button', { name: 'الأموال النقدية' });
  }

  showAssetsButton() {
    return this.cashCard().getByRole('button', { name: 'عرض ألأصول' });
  }

  viewDivisionButton() {
    return this.cashCard().getByRole('button', { name: 'عرض القسمة' });
  }

  /** The agreement checkbox inside the "إقرار وتعهد" card. */
  agreementCheckbox() {
    return this.page
      .locator('div')
      .filter({ hasText: 'إقرار وتعهد' })
      .last()
      .getByRole('checkbox');
  }

  startDivisionButton() {
    return this.page.getByRole('button', { name: 'بدء القسمة', exact: true });
  }

    acceptDivisionButton() {
    return this.page.getByRole('button', { name: 'موافق', exact: true }).last();
  }

  rejectDivisionButton() {
    return this.page.getByRole('button', { name: 'غير موافق', exact: true });
  }

  closePopupIcon() {
    return this.page.locator('.icon-close-for-popup');
  }

  errorPopupBackButton() {
    return this.page.getByRole('button', { name: 'العودة' });
  }

  successDialog() {
    return this.page.getByRole('dialog').filter({ hasText: 'تم تقديم طلب القسمة بنجاح' });
  }

  /** The "حالة الطلب/ القسمة" status for the الأموال النقدية card in the divisions listing. */
  requestStatus() {
    return this.page.getByRole('heading', { name: 'حالة الطلب/ القسمة' }).locator('xpath=..');
  }

  bankAccountTab() {
    return this.page.getByText('الحساب البنكي');
  }

  /** The "حالة الاستعلام" inquiry status in the الحساب البنكي tab. */
  inquiryStatus() {
    return this.page.getByRole('heading', { name: 'حالة الاستعلام' }).locator('xpath=..');
  }
}

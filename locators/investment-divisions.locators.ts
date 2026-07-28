import { Page } from '@playwright/test';

export class InvestmentDivisionsLocators {
  constructor(private readonly page: Page) {}

  /** The "الموجودات الاستثمارية" card. */
  investmentCard() {
    return this.page.getByRole('button', { name: 'الموجودات الاستثمارية' });
  }

  showAssetsButton() {
    return this.investmentCard().getByRole('button', { name: 'عرض ألأصول' });
  }

  viewDivisionButton() {
    return this.investmentCard().getByRole('button', { name: 'عرض القسمة' });
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
    return this.page.getByRole('button', { name: 'الموافقة على القسمة', exact: true }).last();
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

  /** The "حالة الطلب/ القسمة" status for the الموجودات الاستثمارية card in the divisions listing. */
  requestStatus() {
    return this.page.getByRole('heading', { name: 'حالة الطلب/ القسمة' }).locator('xpath=..');
  }
}

import { Page } from '@playwright/test';

export class DivisionRequestLocators {
  constructor(private readonly page: Page) {}

  /** The request card whose "نوع الطلب" matches the given type, e.g. 'قسمة التركة'. */
  requestCard(requestType: string) {
    return this.page.locator('div.grid').filter({
      has: this.page.getByText(requestType, { exact: true }),
    });
  }

  /** The "حالة التوزيع" (distribution status) field in the بيانات الطلب tab of the case details view. */
  distributionStatus() {
    return this.page.getByRole('heading', { name: 'حالة التوزيع' }).locator('xpath=..');
  }

  /** The "مشاهدة التفاصيل" button beside اسم الموّرث. */
  caseDetailsButton() {
    return this.page.getByRole('button', { name: 'مشاهدة التفاصيل' }).first();
  }

  divisionsTabsContainer() {
    return this.page.locator('//*[@id="app"]/div/div/div[3]/div/div[2]/div/div[1]/div[3]/div');
  }

  requestDataTab() {
    return this.divisionsTabsContainer().getByText('بيانات الطلب');
  }
}

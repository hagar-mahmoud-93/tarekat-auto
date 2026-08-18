import { Page } from '@playwright/test';
import { expect } from '../fixtures/base.fixture';
import { DivisionRequestPage } from '../pages/division-pages/division-request.page';
import { MainMenuPage } from '../pages/common-pages/main-menu.page';
import { SeedResult } from '../pages/admin-pages/seeder.page';

export class DivisionsList {
  constructor(
    private readonly beneficiaryTab: Page,
    private readonly result: SeedResult,
  ) {}

  /** Navigates to الطلبات, opens the seeded case's details, then its divisions listing. */
  async run(): Promise<DivisionRequestPage> {
    const divisionRequestPage = new DivisionRequestPage(this.beneficiaryTab);

    await new MainMenuPage(this.beneficiaryTab).openMyOrders();
    await expect(this.beneficiaryTab).toHaveURL(/\/my-orders/);

    await expect(divisionRequestPage.requestCard('قسمة التركة')).toContainText('لم تبدأ بعد');

    await divisionRequestPage.openCaseDetails();
    await expect(this.beneficiaryTab.getByText('تفاصيل الطلب')).toBeVisible();
    await expect(this.beneficiaryTab.getByText(this.result.json.request.requestNumber)).toBeVisible();

    await divisionRequestPage.openDivisionsListingTab();

    return divisionRequestPage;
  }
}
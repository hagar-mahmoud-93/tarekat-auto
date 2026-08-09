import { Page } from '@playwright/test';
import { expect } from '../fixtures/base.fixture';
import { RequestsPage } from '../pages/division-pages/requests.page';
import { SeedResult } from '../pages/admin-pages/seeder.page';

export class DivisionsList {
  constructor(
    private readonly beneficiaryTab: Page,
    private readonly result: SeedResult,
  ) {}

  /** Navigates to الطلبات, opens the seeded case's details, then its divisions listing. */
  async run(): Promise<RequestsPage> {
    const requestsPage = new RequestsPage(this.beneficiaryTab);

    await requestsPage.open();
    await expect(this.beneficiaryTab).toHaveURL(/\/my-orders/);

    await expect(requestsPage.requestCard('قسمة التركة')).toContainText('لم تبدأ بعد');

    await requestsPage.openCaseDetails();
    await expect(this.beneficiaryTab.getByText('تفاصيل الطلب')).toBeVisible();
    await expect(this.beneficiaryTab.getByText(this.result.json.request.requestNumber)).toBeVisible();

    await requestsPage.openDivisionsListingTab();

    return requestsPage;
  }
}
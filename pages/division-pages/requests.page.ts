import { BasePage } from '../base.page';
import { RequestsLocators } from '../../locators/ui-division-locators/requests.locators';

export class RequestsPage extends BasePage {
  private readonly locators = new RequestsLocators(this.page);

  async open() {
    await this.locators.requestsNavLink().click();
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  /** The request card whose "نوع الطلب" matches the given type, e.g. 'قسمة التركة'. */
  requestCard(requestType: string) {
    return this.locators.requestCard(requestType);
  }

  /** The "حالة التوزيع" (distribution status) field in the بيانات الطلب tab of the case details view. */
  distributionStatus() {
    return this.locators.distributionStatus();
  }

  /** Opens the case-level details view (the "مشاهدة التفاصيل" button beside اسم الموّرث). */
  async openCaseDetails() {
    await this.locators.caseDetailsButton().click();
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  async openDivisionsListingTab() {
    await this.locators.divisionsTabsContainer().getByText('قسمة التركة').click();
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  async openRequestDataTab() {
    await this.locators.requestDataTab().click();
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }
}

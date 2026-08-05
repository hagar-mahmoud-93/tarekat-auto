import { BasePage } from '../base.page';
import { AdminIsMockDisabledLocators } from '../../locators/admin-dashboard-locators/admin-is-mock-disabled.locators';

export class AdminIsMockDisabledPage extends BasePage {
  private readonly locators = new AdminIsMockDisabledLocators(this.page);

  async disableValue() {
    await this.locators.valueInput().fill('False');
    await this.locators.saveButton().click();
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }
}

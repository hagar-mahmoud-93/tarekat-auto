import { BasePage } from './base.page';
import { env } from '../config/env';
import { ConfigurationsServiceLocators } from '../locators/configurations-service.locators';

export class ConfigurationsServicePage extends BasePage {
  private readonly locators = new ConfigurationsServiceLocators(this.page);

  async open() {
    await this.page.goto(`${env.admin.apiURL}${env.admin.configurationsServiceURL}`);
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  async showAll() {
    await this.locators.showAllLink().click();
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  async checkAllMockActive() {
    const checkboxes = this.locators.isMockActiveCheckboxes();
    const labels = this.locators.isMockActiveLabels();
    const count = await checkboxes.count();
    for (let i = 0; i < count; i++) {
      if (!(await checkboxes.nth(i).isChecked())) {
        await labels.nth(i).click();
      }
    }
    await this.locators.saveButton().click();
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }
}

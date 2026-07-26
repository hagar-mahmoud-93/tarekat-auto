import { BasePage } from './base.page';
import { env } from '../config/env';
import { DivisionAdminLocators } from '../locators/division-admin.locators';

export class DivisionAdminPage extends BasePage {
  private readonly locators = new DivisionAdminLocators(this.page);

  async open() {
    await this.page.goto(`${env.admin.apiURL}${env.divisionAdmin.apiURL}`);
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  async searchByInheritanceId(inheritanceId: string) {
    await this.locators.searchInput().fill(inheritanceId);
    await this.locators.searchButton().click();
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  async openDashboard() {
    await this.locators.dashboardLink().first().click();
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }
}

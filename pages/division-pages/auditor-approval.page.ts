import { BasePage } from '../base.page';
import { env } from '../../config/env';
import { AuditorApprovalLocators } from '../../locators/admin-division-locators/auditor-approval.locators';

export class AuditorApprovalPage extends BasePage {
  private readonly locators = new AuditorApprovalLocators(this.page);

  async submitAuditorApprove(inheritanceId: string) {
    await this.page.goto(
      `${env.admin.apiURL}/inheritance/inheritance/${inheritanceId}/change/`,
    );
    await this.page.waitForLoadState('networkidle').catch(() => {});

    await this.locators.auditorStatusSelect().selectOption({ value: 'approved' });
    await this.locators.saveButton().click();
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }
}

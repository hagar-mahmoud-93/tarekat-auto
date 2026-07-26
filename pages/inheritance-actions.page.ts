import { BasePage } from './base.page';
import { env } from '../config/env';
import { InheritanceActionsLocators } from '../locators/inheritance-actions.locators';

export class InheritanceActionsPage extends BasePage {
  private readonly locators = new InheritanceActionsLocators(this.page);

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

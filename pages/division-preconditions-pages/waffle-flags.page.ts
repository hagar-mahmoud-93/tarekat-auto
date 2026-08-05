import { BasePage } from '../base.page';
import { env } from '../../config/env';
import { WaffleFlagsLocators } from '../../locators/admin-dashboard-locators/waffle-flags.locators';

export class WaffleFlagsPage extends BasePage {
  private readonly locators = new WaffleFlagsLocators(this.page);

  async open() {
    await this.page.goto(`${env.admin.apiURL}${env.admin.waffleFlagURL}`);
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  async hasFlag(name: string): Promise<boolean> {
    return (await this.locators.flagLink(name).count()) > 0;
  }

  async openFlag(name: string) {
    await this.locators.flagLink(name).click();
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  async openAddForm() {
    await this.page.goto(`${env.admin.apiURL}${env.admin.waffleFlagURL}add/`);
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  async fillName(name: string) {
    await this.locators.nameInput().fill(name);
  }

  /** Sets the "Everyone" override to Yes and saves; Django redirects back to the flag list. */
  async setEveryoneToYesAndSave() {
    await this.locators.everyoneSelect().selectOption('true');
    await this.locators.saveButton().click();
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }
}

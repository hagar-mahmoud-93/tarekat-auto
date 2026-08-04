import { BasePage } from './base.page';
import { CmaApplicationLocators } from '../locators/cma-application.locators';

export class CmaApplicationPage extends BasePage {
  private readonly locators = new CmaApplicationLocators(this.page);

  async fillGroupedNafithNumber(value: string): Promise<void> {
    await this.locators.groupedNafithNumberInput().fill(value);
  }

  /** Clicks "Save", then waits for the change form to reload. */
  async save(): Promise<void> {
    await this.locators.saveButton().click();
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }
}

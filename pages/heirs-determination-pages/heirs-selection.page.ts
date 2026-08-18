import { BasePage } from '../base.page';
import { HeirsSelectionLocators } from '../../locators/heirs-determination-locators/heirs-selection.locators';

export class HeirsSelectionPage extends BasePage {
  private readonly locators = new HeirsSelectionLocators(this.page);

  /**
   * The form's ~44 fields mount asynchronously after navigating into this step; clicking before the last
   * one (الأخوة والأخوات الأشقاء) appears means earlier fields' Vue handlers aren't wired yet, so the click
   * lands but silently fails to update state. Waiting for it first lets the whole form settle.
   */
  async selectNoForAllQuestions() {
    await this.page.getByText('الأخوة والأخوات الأشقاء', { exact: false }).first().waitFor({ state: 'visible' });
    const noRadios = this.locators.noRadios();
    const count = await noRadios.count();
    for (let i = 0; i < count; i++) {
      await noRadios.nth(i).click({ force: true });
    }
  }

  async fillAllCountsWithZero() {
    const numberInputs = this.locators.numberInputs();
    const count = await numberInputs.count();
    for (let i = 0; i < count; i++) {
      await numberInputs.nth(i).fill('0');
    }
  }

  async fillLivingSonsCount(count: string) {
    await this.locators.livingSonsCountInput().fill(count);
  }

  async calculateHeirsCount() {
    await this.locators.calculateHeirsCountButton().click();
  }

  async getHeirsCountText(): Promise<string> {
    return (await this.locators.heirsCountResult().innerText()).trim();
  }
}

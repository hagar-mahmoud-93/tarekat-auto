import { expect } from '@playwright/test';
import { BasePage } from '../base.page';
import { FaqLocators } from '../../locators/crm-locators/help-center.locators';

export class FaqPage extends BasePage {
  private readonly locators = new FaqLocators(this.page);

  /**
   * The list filters client-side on a debounce with no loading indicator, so this waits until the
   * visible question count changes (or the no-results empty state appears) before returning —
   * otherwise callers can act (or screenshot) on the stale, unfiltered list.
   */
  async search(term: string) {
    const initialCount = await this.locators.questionButtons().count();

    await this.locators.searchInput().fill(term);

    await expect(async () => {
      const changed = (await this.locators.questionButtons().count()) !== initialCount;
      const empty = await this.locators.noResultsHeading().isVisible();
      expect(changed || empty).toBe(true);
    }).toPass({ timeout: 5_000 });
  }

  async expandQuestion(text: string) {
    await this.locators.question(text).click();
  }

  question(text: string) {
    return this.locators.question(text);
  }

  answer(text: string) {
    return this.locators.answer(text);
  }

  noResultsHeading() {
    return this.locators.noResultsHeading();
  }

  content() {
    return this.locators.content();
  }
}

import { expect } from '@playwright/test';
import { BasePage } from '../base.page';
import { FaqLocators } from '../../locators/help-center.locators';

export class FaqPage extends BasePage {
  private readonly locators = new FaqLocators(this.page);

  /**
   * The search box is debounced but backed by a real GET /api/v1/faqs/?search= request (not a
   * client-side filter, despite appearances) - waiting on the visible question count/no-results
   * state alone races that request and can resolve on a transient loading frame. Wait for the
   * response to *this* term specifically (not just any /api/v1/faqs/ response) - a generic match
   * can resolve on a stale in-flight response left over from a previous search() call.
   */
  async search(term: string) {
    const initialCount = await this.locators.questionButtons().count();

    const encodedTerm = encodeURIComponent(term);
    const responsePromise = this.page.waitForResponse(
      (response) =>
        response.url().includes('/api/v1/faqs/') &&
        response.url().includes(encodedTerm) &&
        response.request().method() === 'GET',
    );
    await this.locators.searchInput().fill(term);
    await responsePromise;

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

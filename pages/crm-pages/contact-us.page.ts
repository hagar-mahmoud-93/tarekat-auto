import { Page } from '@playwright/test';
import { BasePage } from '../base.page';
import { ContactUsLocators } from '../../locators/help-center.locators';

export class ContactUsPage extends BasePage {
  private readonly locators = new ContactUsLocators(this.page);

  domesticPhoneButton() {
    return this.locators.domesticPhoneButton();
  }

  internationalPhoneButton() {
    return this.locators.internationalPhoneButton();
  }

  emailButton() {
    return this.locators.emailButton();
  }

  /** Clicks a branch's "الموقع" button and returns the Google Maps tab it opens. */
  async openBranchLocation(branchName: string): Promise<Page> {
    const [mapsPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      this.locators.branchLocationButton(branchName).click(),
    ]);
    await mapsPage.waitForLoadState('domcontentloaded').catch(() => {});
    return mapsPage;
  }
}

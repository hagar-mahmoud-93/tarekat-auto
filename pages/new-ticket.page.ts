import { expect } from '@playwright/test';
import { BasePage } from './base.page';
import { NewTicketLocators } from '../locators/new-ticket.locators';

export class NewTicketPage extends BasePage {
  private readonly locators = new NewTicketLocators(this.page);

  /**
   * Step 1 (بيانات مقدم التذكرة): the applicant name/id fields are populated by a
   * verify-applicant call that intermittently fails (503 with no body); reloading
   * retries it. Waits until the name field is populated, then fills the mobile number.
   */
  async fillApplicantStep(mobileNumber: string) {
    await expect(async () => {
      if ((await this.locators.applicantNameInput().inputValue()) === '') {
        await this.page.reload();
      }
      await expect(this.locators.applicantNameInput()).not.toHaveValue('', { timeout: 3000 });
    }).toPass({ timeout: 30_000 });

    await this.locators.mobileNumberInput().fill(mobileNumber);
    await this.clickSaveAndContinue();
  }

  /** Step 2 (بيانات التذكرة): ticket type, main/sub category, and problem details. */
  async fillTicketDetailsStep(opts: {
    type: 'شكوى' | 'طلب';
    mainCategory: string;
    subCategory: string;
    details: string;
  }) {
    await this.locators.ticketTypeRadio(opts.type).click();

    await this.locators.mainCategoryCombobox().click();
    await this.locators.categoryOption(opts.mainCategory).click();

    await this.locators.subCategoryCombobox().click();
    await this.locators.categoryOption(opts.subCategory).click();

    await this.locators.detailsTextbox().fill(opts.details);
    await this.clickSaveAndContinue();
  }

  /**
   * Clicking "حفظ ومتابعة" can itself re-trigger the flaky verify-applicant call, popping
   * the same blank error dialog seen on step 1; dismiss it and retry the click until it advances.
   */
  private async clickSaveAndContinue(maxAttempts: number = 5) {
    const errorBackButton = this.page.getByRole('dialog').getByRole('button', { name: 'العودة' });

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      await this.locators.saveAndContinueButton().click();
      await this.page.waitForLoadState('networkidle').catch(() => {});

      const blocked = await errorBackButton
        .waitFor({ state: 'visible', timeout: 2000 })
        .then(() => true)
        .catch(() => false);
      if (!blocked) return;

      await errorBackButton.click();
    }
    throw new Error(`"حفظ ومتابعة" kept getting blocked by the verify-applicant error after ${maxAttempts} attempts`);
  }

  /** Step 3 (مراجعة بيانات التذكرة): submits and confirms, then waits for the success dialog. */
  async submitTicket() {
    await this.locators.submitTicketButton().click();
    await this.locators.confirmSubmitButton().click();
    await this.page.waitForLoadState('networkidle').catch(() => {});
    await this.locators.successDialog().waitFor({ state: 'visible' });
  }

  /** Extracts the ticket number from the "تم تقديم رقم التذكرة '...' بنجاح" success dialog. */
  async getSubmittedTicketNumber(): Promise<string> {
    const text = await this.locators.successDialog().innerText();
    const match = text.match(/'([\w-]+)'/);
    if (!match) {
      throw new Error(`Could not extract ticket number from success dialog: ${text}`);
    }
    return match[1];
  }
}

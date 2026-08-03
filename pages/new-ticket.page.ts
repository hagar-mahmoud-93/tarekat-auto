import { expect } from '@playwright/test';
import { BasePage } from './base.page';
import { NewTicketLocators } from '../locators/help-center.locators';

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

    // "حفظ ومتابعة" occasionally no-ops on its first click here: no request fires and step 1
    // stays put, without popping the error dialog clickSaveAndContinue already retries on.
    // Re-click until step 2 (the شكوى/طلب radio group) actually renders.
    await expect(async () => {
      await this.clickSaveAndContinue();
      await expect(this.locators.ticketTypeRadio('شكوى')).toBeVisible({ timeout: 3000 });
    }).toPass({ timeout: 30_000 });
  }

  mobileNumberInput() {
    return this.locators.mobileNumberInput();
  }

  mobileNumberRequiredError() {
    return this.locators.mobileNumberRequiredError();
  }

  mobileNumberFormatError() {
    return this.locators.mobileNumberFormatError();
  }

  /**
   * Step 2 (بيانات التذكرة): ticket type, main/sub category, and problem details.
   * Some categories' dynamic form also requires طلبات المستفيد (requestDetails) — pass it
   * when the chosen category/subcategory renders that field.
   */
  async fillTicketDetailsStep(opts: {
    type: 'شكوى' | 'طلب';
    mainCategory: string;
    subCategory: string;
    details: string;
    requestDetails?: string;
  }) {
    await this.selectTicketTypeAndCategory(opts);
    await this.locators.detailsTextbox().fill(opts.details);
    if (opts.requestDetails) {
      await this.locators.requestDetailsTextbox().fill(opts.requestDetails);
    }
    await this.clickSaveAndContinue();
  }

  /** Ticket type + main/sub category, without touching التفاصيل — the fields that make it visible. */
  async selectTicketTypeAndCategory(opts: { type: 'شكوى' | 'طلب'; mainCategory: string; subCategory: string }) {
    await this.locators.ticketTypeRadio(opts.type).click();

    await this.locators.mainCategoryCombobox().click();
    await this.locators.categoryOption(opts.mainCategory).click();

    await this.locators.subCategoryCombobox().click();
    await this.locators.categoryOption(opts.subCategory).click();
  }

  detailsTextbox() {
    return this.locators.detailsTextbox();
  }

  detailsErrorMessage() {
    return this.locators.detailsErrorMessage();
  }

  requestDetailsTextbox() {
    return this.locators.requestDetailsTextbox();
  }

  deceasedIdInput() {
    return this.locators.deceasedIdInput();
  }

  deceasedIdError() {
    return this.locators.deceasedIdError();
  }

  heirsDeedNumberInput() {
    return this.locators.heirsDeedNumberInput();
  }

  heirsDeedNumberError() {
    return this.locators.heirsDeedNumberError();
  }

  async uploadAttachment(fileName: string = 'attachment.pdf') {
    await this.locators.attachmentFileInput().setInputFiles({
      name: fileName,
      mimeType: 'application/pdf',
      buffer: Buffer.from('%PDF-1.4\n%%EOF'),
    });
  }

  /**
   * Clicking "حفظ ومتابعة" can itself re-trigger the flaky verify-applicant call, popping
   * the same blank error dialog seen on step 1; dismiss it and retry the click until it advances.
   * Public because tests that expect this click to fail validation (and stay on the same step)
   * also need to trigger it directly.
   */
  async clickSaveAndContinue(maxAttempts: number = 5) {
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

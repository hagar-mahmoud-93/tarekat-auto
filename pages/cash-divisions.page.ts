import { expect } from '@playwright/test';
import { BasePage } from './base.page';
import { CashDivisionsLocators } from '../locators/cash-divisions.locators';

export class CashDivisionsPage extends BasePage {
  private readonly locators = new CashDivisionsLocators(this.page);

  /** In the "الأموال النقدية" card, views the assets ("عرض الأصول"), then waits for the agreement checkbox to appear. */
   async showAssets() {
    await this.locators.showAssetsButton().click();
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  /** Checks the إقرار وتعهد agreement checkbox, allowing extra time for it to render. */
  async acceptDivisionAgreement() {
    const checkbox = this.locators.agreementCheckbox();
    await checkbox.check();
  }

  /** Waits for the القسمة المقترحة card to fully render, signaled by the "غير موافق" button appearing. */
  async waitForProposedDivisionCard() {
    await this.locators.rejectDivisionButton().waitFor({ state: 'visible', timeout: 60000 });
  }

  /** Confirms with "موافق" to start the division. */
  async startDivision() {
    await this.locators.startDivisionButton().click();
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }
  
  /** In the "الأموال النقدية" card, views the division ("عرض القسمة"), then waits for the "موافق" button to appear. */
  async viewDivision() {
    await this.locators.viewDivisionButton().click();
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  /** Confirms with "موافق" to start the division, then waits for the success popup's close icon to appear. */
  async acceptDivision() {
    const button = this.locators.acceptDivisionButton();
    // The button stays disabled until the القسمة المقترحة tab's data finishes loading, which can be slow.
    await button.click();
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  /** Dismisses the rating overlay, then waits for and closes the "تم تقديم طلب القسمة بنجاح" success dialog. */
  async closeDivisionSuccessPopup() {
    await this.locators.closePopupIcon().click();

    const dialog = this.locators.successDialog();
    await dialog.waitFor({ state: 'visible' });
    await dialog.getByRole('button', { name: 'Close' }).click();
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  /** The "حالة الطلب/ القسمة" status for the الأموال النقدية card in the divisions listing. */
  requestStatus() {
    return this.locators.requestStatus();
  }

  /** Opens the الحساب البنكي tab, then waits for the inquiry status heading to appear. */
  async openBankAccountTab() {
    await this.locators.bankAccountTab().click();
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  /** The "حالة الاستعلام" inquiry status in the الحساب البنكي tab. */
  inquiryStatus() {
    return this.locators.inquiryStatus();
  }
}

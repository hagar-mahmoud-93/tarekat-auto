import { BasePage } from '../base.page';
import { RequestPreviewLocators } from '../../locators/heirs-determination-locators/request-preview.locators';

export class RequestPreviewPage extends BasePage {
  private readonly locators = new RequestPreviewLocators(this.page);

  /** Closes the loading popup shown while the request submits. */
  async closeLoadingPopup() {
    await this.locators.closePopupIcon().click();
  }

  /** Reads the submitted طلب حصر الورثة رقم from the success confirmation. */
  async getSubmittedRequestNumber(): Promise<string> {
    const text = await this.locators.successConfirmation().innerText();
    const match = text.match(/رقم:\s*(\S+)/);
    if (!match) throw new Error(`Could not find a request number in: ${text}`);
    return match[1];
  }

  async viewRequestDetails() {
    await this.locators.viewRequestDetailsButton().click();
  }
}

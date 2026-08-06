import { BasePage } from '../base.page';
import { ApplicantDataLocators } from '../../locators/heirs-determination-locators/applicant-data.locators';

export class ApplicantDataPage extends BasePage {
  private readonly locators = new ApplicantDataLocators(this.page);

  /** Opens the صفة مقدم الطلب dropdown and picks the option matching the given name. */
  async selectRelationToInheritor(name: string) {
    await this.locators.relationToInheritorDropdown().click();
    await this.locators.relationToInheritorOption(name).click();
  }

  async fillMobileNumber(mobileNumber: string) {
    await this.locators.mobileNumberInput().fill(mobileNumber);
  }

  /** Answers "هل توجد وثيقة حصر ورثة سابقة للمتوفى؟"; the radio's visual box covers the input, so the click is forced. */
  async selectPreviousDocumentExists(answer: 'نعم' | 'لا') {
    await this.locators.previousDocumentRadio(answer).click({ force: true });
  }
}

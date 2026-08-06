import { BasePage } from '../base.page';
import { WitnessDataLocators } from '../../locators/heirs-determination-locators/witness-data.locators';

const ID_TYPE_BY_IDENTITY_TYPE: Record<1 | 2, string> = {
  1: 'هوية وطنية',
  2: 'إقامة',
};

export class WitnessDataPage extends BasePage {
  private readonly locators = new WitnessDataLocators(this.page);

  /** Opens صلة قرابة الشاهد بالمورث and picks the first option in the list. */
  async selectAnyRelationToDeceased() {
    await this.locators.relationToDeceasedDropdown().click();
    await this.locators.relationToDeceasedOptions().first().click();
  }

  async fillMobileNumber(mobileNumber: string) {
    await this.locators.mobileNumberInput().fill(mobileNumber);
  }

  /** Opens the نوع الهوية dropdown and picks هوية وطنية for identityType 1, إقامة for identityType 2. */
  async selectIdTypeForIdentityType(identityType: 1 | 2) {
    await this.locators.idTypeDropdown().click();
    await this.locators.idTypeOption(ID_TYPE_BY_IDENTITY_TYPE[identityType]).click();
  }

  async fillIdNumber(idNumber: string) {
    await this.locators.idNumberInput().fill(idNumber);
  }

  async fillBirthDateHijri(birthDateHijri: string) {
    await this.locators.birthDateInput().fill(birthDateHijri);
  }
}

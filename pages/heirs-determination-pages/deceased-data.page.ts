import { BasePage } from '../base.page';
import { DeceasedDataLocators } from '../../locators/heirs-determination-locators/deceased-data.locators';

const ID_TYPE_BY_IDENTITY_TYPE: Record<1 | 2, string> = {
  1: 'هوية وطنية',
  2: 'إقامة',
};

/** 1x1 transparent PNG, used to satisfy the pdf/jpg/jpeg/png/bmp attachment requirement. */
const PLACEHOLDER_PNG_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';

function placeholderImageFile(fileName: string) {
  return { name: fileName, mimeType: 'image/png', buffer: Buffer.from(PLACEHOLDER_PNG_BASE64, 'base64') };
}

export class DeceasedDataPage extends BasePage {
  private readonly locators = new DeceasedDataLocators(this.page);

  async fillIdNumber(idNumber: string) {
    await this.locators.idNumberInput().fill(idNumber);
  }

  /** Opens the نوع الهوية dropdown and picks هوية وطنية for identityType 1, إقامة for identityType 2. */
  async selectIdTypeForIdentityType(identityType: 1 | 2) {
    await this.locators.idTypeDropdown().click();
    await this.locators.idTypeOption(ID_TYPE_BY_IDENTITY_TYPE[identityType]).click();
  }

  async fillBirthDateHijri(birthDateHijri: string) {
    await this.locators.birthDateInput().fill(birthDateHijri);
  }

  async uploadFamilyRegister(fileName: string = 'family-register.png') {
    await this.locators.familyRegisterFileInput().setInputFiles(placeholderImageFile(fileName));
  }

  async uploadDeathCertificate(fileName: string = 'death-certificate.png') {
    await this.locators.deathCertificateFileInput().setInputFiles(placeholderImageFile(fileName));
  }

  async verify() {
    await this.locators.verifyButton().click();
  }

  /** Whether إضافة صلة قرابة مع المورث is still editable, or was auto-filled and disabled after تحقق. */
  async isRelationshipDropdownEnabled(): Promise<boolean> {
    const classAttr = await this.locators.relationshipDropdown().getAttribute('class');
    return !(classAttr ?? '').includes('p-disabled');
  }

  async selectRelationship(name: string) {
    await this.locators.relationshipDropdown().click();
    await this.locators.relationshipOption(name).click();
  }
}

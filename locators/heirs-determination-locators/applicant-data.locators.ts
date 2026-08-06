import { Page } from '@playwright/test';

export class ApplicantDataLocators {
  constructor(private readonly page: Page) {}

  relationToInheritorDropdown() {
    return this.page.locator('#relationToInheritor');
  }

  relationToInheritorOption(name: string) {
    return this.page.getByRole('option', { name });
  }

  mobileNumberInput() {
    return this.page.locator('#mobileNumber');
  }

  /** The نعم/لا radio for "هل توجد وثيقة حصر ورثة سابقة للمتوفى؟"; the underlying input uses value="yes"/"no". */
  previousDocumentRadio(answer: 'نعم' | 'لا') {
    const value = answer === 'نعم' ? 'yes' : 'no';
    return this.page.locator(`input[name="previousDocument"][value="${value}"]`);
  }
}

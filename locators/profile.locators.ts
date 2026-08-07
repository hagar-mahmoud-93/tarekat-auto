import { Page } from '@playwright/test';

export class ProfileLocators {
  constructor(private readonly page: Page) {}

  profileNavLink() {
    return this.page.getByRole('link', { name: 'الملف الشخصي' });
  }

  /**
   * "إلغاء" on the "تقديم طلب حصر ورثة جديد" dialog that a first-time heir login gets bounced to
   * (see ProfilePage.open()) instead of landing on the profile page.
   */
  newUserEstateDialogCancelButton() {
    return this.page.getByRole('button', { name: 'إلغاء' });
  }

  basicDataHeading() {
    return this.page.getByRole('heading', { name: 'البيانات الأساسية' });
  }

  /**
   * The pencil-icon edit button beside the "الجوال" label under البيانات الأساسية. It has no
   * accessible name, so it's located as the label's next sibling button (same shape as
   * ContactUsLocators.branchLocationButton).
   */
  mobileFieldEditButton() {
    return this.page.getByText('الجوال', { exact: true }).locator('xpath=following-sibling::button[1]');
  }

  /** The رقم الجوال textbox revealed by mobileFieldEditButton(), pre-filled with the current number. */
  mobileNumberInput() {
    return this.page.getByPlaceholder('رقم الجوال');
  }

  /** "حفظ" on the الجوال edit form. */
  saveMobileButton() {
    return this.page.getByRole('button', { name: 'حفظ' });
  }

  /** Shown under رقم الجوال when the value isn't a 10-digit number starting with 05. */
  mobileNumberValidationError() {
    return this.page.getByText('يحب ان يبدا الرقم ب (05) وان يكون 10 ارقام');
  }

  /**
   * "بيانات الحساب البنكي" tab button. Its accessible name collides with the page heading shown
   * once that tab is active, so this is scoped to role=button specifically.
   */
  bankAccountsTabButton() {
    return this.page.getByRole('button', { name: 'بيانات الحساب البنكي' });
  }

  /**
   * The content-card title shown once the بيانات الحساب البنكي tab is active. It renders as a
   * plain paragraph, not a heading (unlike basicDataHeading() below, which is a real heading), and
   * Playwright's role engine doesn't resolve getByRole('paragraph', ...) against it even though
   * it shows up as such in an aria snapshot — so this matches on text instead. The tab button's
   * own inner label has the exact same text, so this is scoped to the last match (the button's
   * copy comes first in the DOM).
   */
  bankAccountsHeading() {
    return this.page.getByText('بيانات الحساب البنكي', { exact: true }).last();
  }

  ibanInput() {
    return this.page.getByPlaceholder('ادخل رقم الآيبان الخاص بك');
  }

  /** "تحقق" — submits the IBAN entered in ibanInput(). */
  verifyIbanButton() {
    return this.page.getByRole('button', { name: 'تحقق' });
  }

  /** Shown when the IBAN isn't 24 characters starting with SA. */
  ibanValidationError() {
    return this.page.getByText('يجب أن يكون رقم الآيبان مكون من 24 حرفاً ويبدأ بـSA');
  }

  /** Confirmation shown after a valid IBAN is verified and added. */
  ibanAddedSuccessMessage() {
    return this.page.getByText(/تم إضافة الحساب البنكي/);
  }

  /** "الحساب الأساسي" label on the newly-added account card. */
  primaryAccountLabel() {
    return this.page.getByText('الحساب الأساسي');
  }
}

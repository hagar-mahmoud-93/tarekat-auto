import { Page } from '@playwright/test';

export class HelpLocators {
  constructor(private readonly page: Page) {}

  helpNavLink() {
    return this.page.getByRole('link', { name: 'المساعدة' });
  }

  /** The "تذاكر الدعم" card's button on the مركز المساعدة page. */
  supportTicketsCard() {
    return this.page.locator('div').filter({ hasText: 'تذاكر الدعم' }).last().getByRole('button');
  }

  /** The "الأسئلة الشائعة" card's button on the مركز المساعدة page. */
  faqCard() {
    return this.page.locator('div').filter({ hasText: 'الأسئلة الشائعة' }).last().getByRole('button');
  }

  /** The "اتصل بنا" card's button on the مركز المساعدة page. */
  contactUsCard() {
    return this.page.locator('div').filter({ hasText: 'اتصل بنا' }).last().getByRole('button');
  }

  /** The "إنشاء تذكرة" button on the tickets listing (/help/complaints). */
  createTicketButton() {
    return this.page.getByRole('button', { name: 'إنشاء تذكرة' });
  }

  /** The "لا يوجد تذاكر" empty-state heading on the tickets listing. */
  noTicketsHeading() {
    return this.page.getByRole('heading', { name: 'لا يوجد تذاكر' });
  }
}

export class FaqLocators {
  constructor(private readonly page: Page) {}

  searchInput() {
    return this.page.getByRole('textbox', { name: 'البحث في الأسئلة الشائعة' });
  }

  /** An accordion question button, matched by its full question text. */
  question(text: string) {
    return this.page.getByRole('button', { name: text });
  }

  /** All accordion question buttons currently rendered (i.e. matching the active search filter). */
  questionButtons() {
    return this.content().getByRole('button');
  }

  /** The expanded answer region for a question, matched by the question's accessible name. */
  answer(text: string) {
    return this.page.getByRole('region', { name: text });
  }

  /** The "لم نعثر على أي أسئلة متعلقة" empty-state shown when a search has no matches. */
  noResultsHeading() {
    return this.page.getByText('لم نعثر على أي أسئلة متعلقة');
  }

  /**
   * The FAQ content block (title, search box, category chips, accordion list) — everything below
   * the shared page header, which shows the live date/time and logged-in user's name and would
   * make a full-page screenshot non-deterministic. Located as the 4th ancestor of the page title
   * text, which is the shallowest ancestor that still excludes that header.
   */
  content() {
    return this.page.getByText('الأسئلة الشائعة', { exact: true }).locator('xpath=../../../..');
  }
}

export class ContactUsLocators {
  constructor(private readonly page: Page) {}

  domesticPhoneButton() {
    return this.page.getByRole('button', { name: '1950', exact: true });
  }

  internationalPhoneButton() {
    return this.page.getByRole('button', { name: '+966 9200 01950' });
  }

  emailButton() {
    return this.page.getByRole('button', { name: '1950@moj.gov.sa' });
  }

  /**
   * The "الموقع" button for a ناجز branch card, matched by the branch's name. The button is a
   * sibling of the branch's name/address block, not a descendant of it, so it's located via the
   * XPath `following` axis (next matching node in document order) rather than DOM nesting.
   */
  branchLocationButton(branchName: string) {
    return this.page.getByText(branchName, { exact: true }).locator('xpath=following::button[1]');
  }
}

export class NewTicketLocators {
  constructor(private readonly page: Page) {}

  /** The disabled "اسم مقدم التذكرة" field, auto-filled once verify-applicant succeeds. */
  applicantNameInput() {
    return this.page.locator('div').filter({ hasText: 'اسم مقدم التذكرة' }).last().getByRole('textbox');
  }

  mobileNumberInput() {
    return this.page.getByRole('textbox', { name: 'رقم الجوال' });
  }

  /** Shown after the mobile number field is touched (focused then blurred) while empty. */
  mobileNumberRequiredError() {
    return this.page.getByText('هذا الحقل مطلوب');
  }

  /** Shown after blur when the value isn't a valid 10-digit Saudi mobile number (05XXXXXXXX). */
  mobileNumberFormatError() {
    return this.page.getByText('الرقم المدخل غير صحيح');
  }

  ticketTypeRadio(type: 'شكوى' | 'طلب') {
    return this.page.getByRole('radio', { name: type });
  }

  mainCategoryCombobox() {
    return this.page.locator('div').filter({ hasText: 'التصنيف الرئيسي' }).last().getByRole('combobox');
  }

  subCategoryCombobox() {
    return this.page.locator('div').filter({ hasText: 'التصنيف الفرعي' }).last().getByRole('combobox');
  }

  categoryOption(name: string) {
    return this.page.getByRole('option', { name });
  }

  detailsTextbox() {
    return this.page.getByRole('textbox', { name: 'ادخل تفاصيل المشكلة' });
  }

  /**
   * The التفاصيل field's error paragraph (required or min-50-chars), located as the textbox's
   * following sibling rather than by its text — that text also appears in an always-visible hint
   * below the field, so matching by text would hit both.
   */
  detailsErrorMessage() {
    return this.detailsTextbox().locator('xpath=following-sibling::p');
  }

  requestDetailsTextbox() {
    return this.page.getByRole('textbox', { name: 'ادخل تفاصيل الطلبات' });
  }

  /**
   * "رقم هوية المتوفي" / "رقم وثيقة حصر الورثة" only render for categories whose dynamic form
   * requires them (e.g. خدمة حصر التركة). Neither textbox exposes an accessible name, so they're
   * matched the same way as applicantNameInput: by the wrapper div containing the field's label.
   */
  deceasedIdInput() {
    return this.page.locator('div').filter({ hasText: 'رقم هوية المتوفي' }).last().getByRole('textbox');
  }

  heirsDeedNumberInput() {
    return this.page.locator('div').filter({ hasText: 'رقم وثيقة حصر الورثة' }).last().getByRole('textbox');
  }

  /**
   * Both these fields are checked by one POST /ticketing/validate-inheritance/ call, triggered
   * only once every other required field is already valid. As of this writing the backend
   * returns a single error even when only one field is actually wrong, and the frontend renders
   * that same message under both fields — so deceasedIdError() and heirsDeedNumberError() can
   * show identical text.
   */
  deceasedIdError() {
    return this.deceasedIdInput().locator('xpath=following-sibling::*[1]');
  }

  heirsDeedNumberError() {
    return this.heirsDeedNumberInput().locator('xpath=following-sibling::*[1]');
  }

  attachmentFileInput() {
    return this.page.locator('input[type="file"]');
  }

  /** The "حفظ ومتابعة" button used in steps 1 and 2 to advance to the next step. */
  saveAndContinueButton() {
    return this.page.getByRole('button', { name: 'حفظ ومتابعة' });
  }

  /** The "تقديم التذكرة" button on the step 3 review page (opens the confirmation dialog). */
  submitTicketButton() {
    return this.page.getByRole('button', { name: 'تقديم التذكرة', exact: true });
  }

  /** The "هل انت متاكد من تقديم التذكرة؟" confirmation dialog's submit button. */
  confirmSubmitButton() {
    return this.page.getByRole('dialog').filter({ hasText: 'هل انت متاكد من تقديم التذكرة؟' }).getByRole('button', { name: 'تقديم التذكرة' });
  }

  /** The "تم تقديم رقم التذكرة '...' بنجاح" success dialog. */
  successDialog() {
    return this.page.getByRole('dialog').filter({ hasText: 'تم تقديم رقم التذكرة' });
  }
}

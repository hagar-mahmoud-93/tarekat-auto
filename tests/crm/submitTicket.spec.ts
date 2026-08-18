import { test, expect } from '../../fixtures/base.fixture';
import { env } from '../../config/env';
import { DataPreparation } from '../../steps/inheritance-seeder-data-preparation';
import { fillMobileNumberIfPrompted } from '../../steps/fill-mobile-number';
import { HelpPage } from '../../pages/crm-pages/help.page';
import { NewTicketPage } from '../../pages/crm-pages/new-ticket.page';

test.describe('CRM complaints', () => {
  // These flows go through the verify-applicant/Dynamics-CRM proxy (see specs/crm-help-center.md,
  // "Known issue"), which intermittently 503s independent of the retry loops already in
  // NewTicketPage (fillApplicantStep, clickSaveAndContinue). Retry at the test level to absorb
  // a bad run without masking a real regression.
  test.describe.configure({ retries: 2 });

  test('Beneficiary submits a new support ticket via المساعدة @crm', async ({ seederPage, request }) => {
    test.setTimeout(120_000);
    test.skip(!env.admin.username || !env.admin.password, 'ADMIN_USERNAME/ADMIN_PASSWORD not set');

    const dataPreparation = new DataPreparation(seederPage, request);
    const { beneficiaryTab } = await dataPreparation.seedCase();

    const helpPage = new HelpPage(beneficiaryTab);
    const newTicketPage = new NewTicketPage(beneficiaryTab);

    await test.step('Navigate to المساعدة > تذاكر الدعم and start a new ticket', async () => {
      await helpPage.open();
      await fillMobileNumberIfPrompted(beneficiaryTab);
      await helpPage.openSupportTickets();
      await expect(helpPage.noTicketsHeading()).toBeVisible();
      await helpPage.createNewTicket();
    });

    await test.step('Submit a complaint ticket about a delayed حصر التركة document', async () => {
      await newTicketPage.fillApplicantStep('0501234567');

      await newTicketPage.fillTicketDetailsStep({
        type: 'شكوى',
        mainCategory: 'خدمة حصر التركة',
        subCategory: 'تخطي مدة الخدمة لطلب اصدار وثيقة حصر التركة',
        details:
          'تأخر إصدار وثيقة حصر التركة عن المدة النظامية المعلنة للخدمة منذ أكثر من أسبوعين، الرجاء المتابعة.',
        requestDetails: 'الرجاء التعجيل بإصدار وثيقة حصر التركة والتواصل معي فور الانتهاء منها.',
      });

      await newTicketPage.submitTicket();

      const ticketNumber = await newTicketPage.getSubmittedTicketNumber();
      expect(ticketNumber).toMatch(/^\d+$/);
    });

    await beneficiaryTab.close();
  });

  test('Applicant step validates the mobile number field @crm', async ({ seederPage, request }) => {
    test.setTimeout(60_000);
    test.skip(!env.admin.username || !env.admin.password, 'ADMIN_USERNAME/ADMIN_PASSWORD not set');

    const dataPreparation = new DataPreparation(seederPage, request);
    const { beneficiaryTab } = await dataPreparation.seedCase();

    const helpPage = new HelpPage(beneficiaryTab);
    const newTicketPage = new NewTicketPage(beneficiaryTab);

    await test.step('Navigate to المساعدة > تذاكر الدعم and start a new ticket', async () => {
      await helpPage.open();
      await fillMobileNumberIfPrompted(beneficiaryTab);
      await helpPage.openSupportTickets();
      await helpPage.createNewTicket();
    });

    await test.step('Touching the field while empty shows a required-field error', async () => {
      await newTicketPage.mobileNumberInput().click();
      await newTicketPage.mobileNumberInput().blur();
      await expect(newTicketPage.mobileNumberRequiredError()).toBeVisible();
    });

    await test.step('Letters are rejected as typed, and the field caps at 10 digits', async () => {
      await newTicketPage.mobileNumberInput().fill('abc123xyz');
      await expect(newTicketPage.mobileNumberInput()).toHaveValue('123');

      await newTicketPage.mobileNumberInput().fill('12345678901234');
      await expect(newTicketPage.mobileNumberInput()).toHaveValue('1234567890');
    });

    await test.step('A 10-digit number that is not a valid Saudi mobile number shows a format error', async () => {
      await newTicketPage.mobileNumberInput().fill('1234567890');
      await newTicketPage.mobileNumberInput().blur();
      await expect(newTicketPage.mobileNumberFormatError()).toBeVisible();
    });

    await test.step('A valid Saudi mobile number (05XXXXXXXX) clears the error', async () => {
      await newTicketPage.mobileNumberInput().fill('0531234567');
      await newTicketPage.mobileNumberInput().blur();
      await expect(newTicketPage.mobileNumberFormatError()).toBeHidden();
      await expect(newTicketPage.mobileNumberRequiredError()).toBeHidden();
    });

    await beneficiaryTab.close();
  });

  test('Ticket details step validates the التفاصيل field @crm', async ({ seederPage, request }) => {
    test.setTimeout(60_000);
    test.skip(!env.admin.username || !env.admin.password, 'ADMIN_USERNAME/ADMIN_PASSWORD not set');

    const dataPreparation = new DataPreparation(seederPage, request);
    const { beneficiaryTab } = await dataPreparation.seedCase();

    const helpPage = new HelpPage(beneficiaryTab);
    const newTicketPage = new NewTicketPage(beneficiaryTab);

    await test.step('Navigate to step 2 (بيانات التذكرة) via a category with no dynamic fields', async () => {
      await helpPage.open();
      await fillMobileNumberIfPrompted(beneficiaryTab);
      await helpPage.openSupportTickets();
      await helpPage.createNewTicket();
      await newTicketPage.fillApplicantStep('0501234567');
      await newTicketPage.selectTicketTypeAndCategory({
        type: 'شكوى',
        mainCategory: 'خدمة حصر التركة',
        subCategory: 'عدم صحة البيانات الواردة في وثيقة حصر التركة',
      });
    });

    await test.step('Touching the field while empty shows a required-field error', async () => {
      await newTicketPage.detailsTextbox().click();
      await newTicketPage.detailsTextbox().blur();
      await expect(newTicketPage.detailsErrorMessage()).toHaveText('هذا الحقل مطلوب');
    });

    await test.step('Fewer than 50 characters shows a min-length error', async () => {
      await newTicketPage.detailsTextbox().fill('نص قصير');
      await newTicketPage.detailsTextbox().blur();
      await expect(newTicketPage.detailsErrorMessage()).toHaveText('الرجاء تعبئة التفاصيل بحد أدنى 50 حرفاً');
    });

    await test.step('50 or more characters clears the error', async () => {
      await newTicketPage.detailsTextbox().fill(
        'تأخر تحويل مبلغ القسمة النقدية إلى حسابي البنكي منذ أكثر من أسبوعين ولم يتم استلامه حتى الآن',
      );
      await newTicketPage.detailsTextbox().blur();
      await expect(newTicketPage.detailsErrorMessage()).toBeHidden();
    });

    await beneficiaryTab.close();
  });

  test('Ticket details step validates the deceased ID and heir-enumeration deed number fields @crm', async ({
    seederPage,
    request,
  }) => {
    test.setTimeout(60_000);
    test.skip(!env.admin.username || !env.admin.password, 'ADMIN_USERNAME/ADMIN_PASSWORD not set');

    const dataPreparation = new DataPreparation(seederPage, request);
    const { beneficiaryTab } = await dataPreparation.seedCase();

    const helpPage = new HelpPage(beneficiaryTab);
    const newTicketPage = new NewTicketPage(beneficiaryTab);

    await test.step('Navigate to step 2 via خدمة حصر التركة, whose dynamic form adds these fields', async () => {
      await helpPage.open();
      await fillMobileNumberIfPrompted(beneficiaryTab);
      await helpPage.openSupportTickets();
      await helpPage.createNewTicket();
      await newTicketPage.fillApplicantStep('0501234567');
      await newTicketPage.selectTicketTypeAndCategory({
        type: 'شكوى',
        mainCategory: 'خدمة حصر التركة',
        subCategory: 'عدم صحة البيانات الواردة في وثيقة حصر التركة',
      });
    });

    await test.step('Submitting made-up ID/deed numbers surfaces "not found in system" on both fields', async () => {
      await newTicketPage.deceasedIdInput().fill('1234567890');
      await newTicketPage.heirsDeedNumberInput().fill('999999');
      // Both remaining required fields need a valid value too: the deceased-ID/deed-number check
      // only runs once the rest of the form already passes validation.
      await newTicketPage.detailsTextbox().fill(
        'هذا نص تفاصيل تجريبي يجب ان يتجاوز خمسين حرفا لاختبار رسالة الخطأ في النظام',
      );
      await newTicketPage.requestDetailsTextbox().fill(
        'هذا نص طلبات المستفيد التجريبي يجب ان يتجاوز خمسين حرفا لاختبار رسالة الخطأ في النظام',
      );
      await newTicketPage.uploadAttachment();

      await newTicketPage.clickSaveAndContinue();

      // As of this writing the backend's single combined error renders under both fields — see
      // NewTicketLocators.deceasedIdError().
      const notFoundError = 'رقم هوية المتوفى غير موجود في النظام';
      await expect(newTicketPage.deceasedIdError()).toHaveText(notFoundError);
      await expect(newTicketPage.heirsDeedNumberError()).toHaveText(notFoundError);
    });

    await beneficiaryTab.close();
  });
});

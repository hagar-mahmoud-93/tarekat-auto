import { test, expect } from '../../fixtures/base.fixture';
import { env } from '../../config/env';
import { DataPreparation } from '../../steps/data-preparation';
import { fillMobileNumberIfPrompted } from '../../steps/fill-mobile-number';
import { HelpPage } from '../../pages/help.page';
import { NewTicketPage } from '../../pages/new-ticket.page';

test.describe('CRM complaints', () => {

  test('Beneficiary submits a new support ticket via المساعدة', async ({ seederPage, request }) => {
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

    await test.step('Submit a complaint ticket about a delayed cash division transfer', async () => {
      await newTicketPage.fillApplicantStep('0501234567');

      await newTicketPage.fillTicketDetailsStep({
        type: 'شكوى',
        mainCategory: 'خدمة قسمة التركة النقدية',
        subCategory: 'تأخر تحويل المبالغ - اختبار',
        details:
          'تأخر تحويل مبلغ القسمة النقدية إلى حسابي البنكي منذ أكثر من أسبوعين ولم يتم استلامه حتى الآن، الرجاء المتابعة.',
      });

      await newTicketPage.submitTicket();

      const ticketNumber = await newTicketPage.getSubmittedTicketNumber();
      expect(ticketNumber).toMatch(/^\d+$/);
    });
  });
});

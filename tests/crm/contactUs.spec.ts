import { test, expect } from '../../fixtures/base.fixture';
import { env } from '../../config/env';
import { DataPreparation } from '../../steps/data-preparation';
import { fillMobileNumberIfPrompted } from '../../steps/fill-mobile-number';
import { HelpPage } from '../../pages/help.page';
import { ContactUsPage } from '../../pages/contact-us.page';

test.describe('CRM Help Center - Contact us', () => {
  test('Beneficiary views contact details and opens a branch location @crm', async ({ seederPage, request }) => {
    test.setTimeout(60_000);
    test.skip(!env.admin.username || !env.admin.password, 'ADMIN_USERNAME/ADMIN_PASSWORD not set');

    const dataPreparation = new DataPreparation(seederPage, request);
    const { beneficiaryTab } = await dataPreparation.seedCase();

    const helpPage = new HelpPage(beneficiaryTab);
    const contactUsPage = new ContactUsPage(beneficiaryTab);

    await test.step('Navigate to المساعدة > اتصل بنا', async () => {
      await helpPage.open();
      await fillMobileNumberIfPrompted(beneficiaryTab);
      await helpPage.openContactUs();
    });

    await test.step('Domestic/international phone numbers and email are shown', async () => {
      await expect(contactUsPage.domesticPhoneButton()).toBeVisible();
      await expect(contactUsPage.internationalPhoneButton()).toBeVisible();
      await expect(contactUsPage.emailButton()).toBeVisible();
    });

    const branches = ['مركز ناجز فرع جدة', 'مركز ناجز فرع الرياض', 'مركز ناجز فرع الدمام'];
    for (const branch of branches) {
      await test.step(`"الموقع" opens ${branch} on Google Maps in a new tab`, async () => {
        const mapsPage = await contactUsPage.openBranchLocation(branch);
        await expect(mapsPage).toHaveURL(/google\.com\/maps/);
        await mapsPage.close();
      });
    }

    await beneficiaryTab.close();
  });
});

import { test, expect } from '../../fixtures/base.fixture';
import { env } from '../../config/env';
import { DataPreparation } from '../../steps/data-preparation';
import { fillMobileNumberIfPrompted } from '../../steps/fill-mobile-number';
import { HelpPage } from '../../pages/help.page';
import { FaqPage } from '../../pages/faq.page';

/**
 * The FAQ page is static content (no per-user or per-session data), so its content is asserted
 * via visual snapshots of FaqPage.content() rather than per-string text matching — one screenshot
 * diff catches wording/layout/category changes that a handful of toBeVisible() calls would miss.
 * First run against this suite has no baselines yet; Playwright will generate them and fail once —
 * rerun to pass, and commit the generated PNGs under tests/crm/faq.spec.ts-snapshots/.
 */
test.describe('CRM Help Center - FAQ', () => {
  test('FAQ content matches its visual baseline across search and expand states @crm', async ({ seederPage, request }) => {
    test.setTimeout(60_000);
    test.skip(!env.admin.username || !env.admin.password, 'ADMIN_USERNAME/ADMIN_PASSWORD not set');

    const dataPreparation = new DataPreparation(seederPage, request);
    const { beneficiaryTab } = await dataPreparation.seedCase();

    const helpPage = new HelpPage(beneficiaryTab);
    const faqPage = new FaqPage(beneficiaryTab);
    const question = 'هل يمكن تقديم طلب بموجب وكالة؟';

    await test.step('Navigate to المساعدة > الأسئلة الشائعة', async () => {
      await helpPage.open();
      await fillMobileNumberIfPrompted(beneficiaryTab);
      await helpPage.openFaq();
    });

    await test.step('The default FAQ list matches its baseline', async () => {
      await expect(faqPage.content()).toHaveScreenshot('faq-default.png', { animations: 'disabled' });
    });

    await test.step('Searching narrows the list — matches its baseline', async () => {
      await faqPage.search('وكالة');
      await expect(faqPage.content()).toHaveScreenshot('faq-search-match.png', { animations: 'disabled' });
    });

    await test.step('A search with no matches shows the empty state — matches its baseline', async () => {
      await faqPage.search('xyznonexistent123');
      await expect(faqPage.content()).toHaveScreenshot('faq-search-empty.png', { animations: 'disabled' });
    });

    await test.step('Expanding a question reveals its answer — matches its baseline', async () => {
      await faqPage.search('وكالة');
      await faqPage.expandQuestion(question);
      await expect(faqPage.content()).toHaveScreenshot('faq-expanded.png', { animations: 'disabled' });
    });

    await beneficiaryTab.close();
  });
});

import { test, expect } from '../../fixtures/base.fixture';
import { env } from '../../config/env';
import { DataPreparation } from '../../steps/data-preparation';
import { RequestsPage } from '../../pages/division-pages/requests.page';
import { EstateInventoryPage } from '../../pages/division-pages/estate-inventory.page';
import { EstateAssetCard } from '../../locators/ui-division-locators/estate-inventory.locators';

// See specs/estate-inventory.md for the full area map this coverage is based on.
test.describe('Estate inventory (حصر التركة)', () => {
  test('shows queried asset cards, empty cards, header actions, and a post-inventory progress stepper @estate-inventory', async ({
    seederPage,
    request,
  }) => {
    test.setTimeout(120_000);
    test.skip(!env.admin.username || !env.admin.password, 'ADMIN_USERNAME/ADMIN_PASSWORD not set');

    let estateInventoryPage: EstateInventoryPage;

    await test.step('Seed a case and open its حصر التركة tab', async () => {
      const dataPreparation = new DataPreparation(seederPage, request);
      const { beneficiaryTab } = await dataPreparation.seedCase('cashBankInvestmentAccounts');

      const requestsPage = new RequestsPage(beneficiaryTab);
      await requestsPage.open();
      await requestsPage.openCaseDetails();

      estateInventoryPage = new EstateInventoryPage(beneficiaryTab);
      await estateInventoryPage.open();

      await expect(estateInventoryPage.heading()).toBeVisible();
    });

    await test.step('Cash and investment asset cards show a completed inquiry with a working عرض الأصول button', async () => {
      const queriedCards: EstateAssetCard[] = ['الأموال النقدية', 'الموجودات الاستثمارية'];
      for (const name of queriedCards) {
        await expect(estateInventoryPage.cardStatus(name)).toBeVisible();
        await expect(estateInventoryPage.viewAssetsButton(name)).toBeEnabled();
      }
    });

    await test.step('Asset/rights types the seeder does not generate show their own empty state', async () => {
      const emptyCards: Array<[EstateAssetCard, string]> = [
        ['عقارات', 'لا يوجد عقارات'],
        ['الإقرارات', 'لا توجد إقرارات'],
        ['سندات', 'لا توجد سندات'],
        ['السجلات التجارية', 'لا توجد سجلات تجارية'],
        ['الديون الموثقة', 'لا توجد ديون موثقة'],
        ['وصايا', 'لا توجد وصايا'],
      ];
      for (const [name, text] of emptyCards) {
        await expect(estateInventoryPage.emptyStateText(name, text)).toBeVisible();
      }
    });

    await test.step('Header actions: full-document download enabled, re-query disabled (inventory already complete)', async () => {
      await expect(estateInventoryPage.downloadFullDocumentButton()).toBeEnabled();
      await expect(estateInventoryPage.requeryButton()).toBeDisabled();
    });

    await test.step('Progress stepper shows حصر الورثة/حصر التركة complete, قسمة التركة in progress', async () => {
      const hijriDate = /\d{4}\/\d{2}\/\d{2} هـ/;
      await expect(estateInventoryPage.stepperStep('حصر الورثة')).toContainText(hijriDate);
      await expect(estateInventoryPage.stepperStep('حصر التركة')).toContainText(hijriDate);
      // Real content bug, confirmed via codepoint dump during exploration (not a copy/paste
      // artifact): "التنفيذ" renders with U+065D in place of ف (U+0641). Asserting the exact
      // (buggy) string on purpose so a future content fix breaks this test and gets noticed.
      await expect(estateInventoryPage.stepperStep('قسمة التركة')).toContainText('قيد التنٝيذ');
    });

    await test.step('Debt-acknowledgment and judicial-division entry points are present', async () => {
      await expect(estateInventoryPage.acknowledgeDebtButton()).toBeVisible();
      await expect(estateInventoryPage.startJudicialDivisionButton()).toBeVisible();
    });
  });
});

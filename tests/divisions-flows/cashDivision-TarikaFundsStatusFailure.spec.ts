import { test, expect } from '../../fixtures/base.fixture';
import { env } from '../../config/env';
import { CashDivisionsPage } from '../../pages/division-pages/cash-divisions.page';
import { DataPreparation } from '../../steps/inheritance-seeder-data-preparation';
import { DivisionsList } from '../../steps/divisions-list';
import { HeirAcceptance } from '../../steps/heir-acceptance';
import { openDivisionDashboard } from '../../steps/open-division-dashboard';
import { AuditorApprovalPage } from '../../pages/division-pages/auditor-approval.page';
import { TarikaFundsStatusClient } from '../../api/clients/tarika-funds-status.client';
import { fillMobileNumberIfPrompted } from '../../steps/fill-mobile-number';
import { DivisionType } from '../../pages/admin-pages/seeder.page';
import { MainMenuPage } from '../../pages/common-pages/main-menu.page';

// Full failure only (every deceased asset fails) across all three asset-mix seeds. Partial
// failure (some assets in the same case fail, others succeed) isn't covered yet - see
// specs/cash-division.md.
const CASES: Array<{ label: string; divisionType: DivisionType; simulateTypes: DivisionType[] }> = [
  { label: 'Bank Accounts', divisionType: 'cashBankAccounts', simulateTypes: ['cashBankAccounts'] },
  { label: 'Investment Accounts', divisionType: 'cashInvestmentAccounts', simulateTypes: ['cashInvestmentAccounts'] },
  {
    label: 'Bank And Investment Accounts',
    divisionType: 'cashBankInvestmentAccounts',
    simulateTypes: ['cashBankAccounts', 'cashInvestmentAccounts'],
  },
];

test.describe('Inheritance seeder', () => {
  for (const { label, divisionType, simulateTypes } of CASES) {
    test(`Cash division - ${label} - Tarika funds status failure for all deceased assets @division @cash-division`, async ({
      seederPage,
      request,
      page: adminPage,
    }) => {
      test.setTimeout(300_000); // long multi-stage flow with real backend processing between steps
      test.skip(!env.admin.username || !env.admin.password, 'ADMIN_USERNAME/ADMIN_PASSWORD not set');

      let result: Awaited<ReturnType<DataPreparation['seedCase']>>['result'];
      let beneficiaryTab: Awaited<ReturnType<DataPreparation['seedCase']>>['beneficiaryTab'];
      let requestsPage: Awaited<ReturnType<DivisionsList['run']>>;
      let cashDivisionsPage: CashDivisionsPage;
      let divisionId: string;

      await test.step('Seed case and open the divisions listing', async () => {
        const dataPreparation = new DataPreparation(seederPage, request);
        ({ result, beneficiaryTab } = await dataPreparation.seedCase(divisionType));

        const divisionsList = new DivisionsList(beneficiaryTab, result);
        requestsPage = await divisionsList.run();

        cashDivisionsPage = new CashDivisionsPage(beneficiaryTab);
      });

      await test.step('Beneficiary starts and accepts the proposed division', async () => {
        await cashDivisionsPage.showAssets();
        await fillMobileNumberIfPrompted(beneficiaryTab);
        await cashDivisionsPage.acceptDivisionAgreement();
        await cashDivisionsPage.startDivision();

        await cashDivisionsPage.waitForProposedDivisionCard();
        await cashDivisionsPage.acceptDivisionAgreement();
        await cashDivisionsPage.acceptDivision();

        await cashDivisionsPage.closeDivisionSuccessPopup();
      });

      await test.step('Verify request is awaiting heirs approval', async () => {
        await new MainMenuPage(beneficiaryTab).openMyOrders();
        await expect(beneficiaryTab).toHaveURL(/\/my-orders/);

        await requestsPage.openCaseDetails();
        await requestsPage.openDivisionsListingTab();
        await expect(cashDivisionsPage.requestStatus()).toContainText('بانتظار موافقة الورثة');
      });

      await test.step('Auditor approves the division before the heirs approve', async () => {
        // Use a separate tab: `adminPage` is the same underlying page as `seederPage`, and the
        // heir-acceptance step below still needs the seeder tool's "Login as User" rows on that
        // page - navigating it to the admin dashboard here would wipe those out first.
        const adminActionsPage = await adminPage.context().newPage();
        divisionId = await openDivisionDashboard(adminActionsPage, result.inheritanceId);

        await new AuditorApprovalPage(adminActionsPage).submitAuditorApprove(result.inheritanceId);
      });

      await test.step('All heirs approve the division', async () => {
        const heirAcceptance = new HeirAcceptance(seederPage, result);
        await heirAcceptance.run();
      });

      await test.step('Verify bank account inquiry is in progress', async () => {
        await requestsPage.openDivisionsListingTab();
        await cashDivisionsPage.viewDivision();
        await cashDivisionsPage.openBankAccountTab();
        await expect(cashDivisionsPage.inquiryStatus()).toContainText('قيد الاستعلام');
      });

      await test.step('Simulate Tarika funds status failing for every deceased asset', async () => {
        const tarikaFundsStatusClient = new TarikaFundsStatusClient(request);
        for (const simulateType of simulateTypes) {
          await tarikaFundsStatusClient.simulate(result, divisionId, simulateType, 'failure');
        }
      });

      await test.step('Verify the division shows a transfer-service error', async () => {
        await cashDivisionsPage.openDistributionStatusTab();
        await expect(cashDivisionsPage.distributionStatusError()).toContainText('حدث خطأ في خدمة التحويل');
      });
    });
  }
});

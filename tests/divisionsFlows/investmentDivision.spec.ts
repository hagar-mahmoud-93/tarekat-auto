import { test, expect } from '../../fixtures/base.fixture';
import { env } from '../../config/env';
import { InvestmentDivisionsPage } from '../../pages/investment-divisions.page';
import { DataPreparation } from '../../steps/data-preparation';
import { DivisionsList } from '../../steps/divisions-list';
import { HeirAcceptance } from '../../steps/heir-acceptance';
import { openDivisionDashboard } from '../../steps/open-division-dashboard';
import { InheritanceActionsPage } from '../../pages/inheritance-actions.page';
import { TarikaFundsStatusClient } from '../../api/clients/cashDivisionAPIs/tarika-funds-status-cashBankAccounts.client';
import { TarikaDistributeReqClient } from '../../api/clients/cashDivisionAPIs/tarika-distribute-req.client';
import { fillMobileNumberIfPrompted } from '../../steps/fill-mobile-number';
import { DivisionDashboardPage } from '../../pages/division-dashboard.page';
import { SubmitTarikaFundsResults } from '../../steps/submit-tarika-funds-results';

test.describe('Inheritance seeder', () => {

  test('Investment division - Transfer flow @smoke', async ({ seederPage, request, page: adminPage }) => {
    test.setTimeout(300_000); // long multi-stage flow with real backend processing between steps
    test.skip(!env.admin.username || !env.admin.password, 'ADMIN_USERNAME/ADMIN_PASSWORD not set');

    let result: Awaited<ReturnType<DataPreparation['seedCase']>>['result'];
    let beneficiaryTab: Awaited<ReturnType<DataPreparation['seedCase']>>['beneficiaryTab'];
    let requestsPage: Awaited<ReturnType<DivisionsList['run']>>;
    let investmentDivisionsPage: InvestmentDivisionsPage;
    let divisionId: string;
    let divisionDashboardPage: DivisionDashboardPage;

    await test.step('Seed case and open the divisions listing', async () => {
      const dataPreparation = new DataPreparation(seederPage, request);
      ({ result, beneficiaryTab } = await dataPreparation.seedCase());

      const divisionsList = new DivisionsList(beneficiaryTab, result);
      requestsPage = await divisionsList.run();

      investmentDivisionsPage = new InvestmentDivisionsPage(beneficiaryTab);
    });

    await test.step('Beneficiary starts and accepts the proposed division', async () => {
      await investmentDivisionsPage.showAssets();
      await fillMobileNumberIfPrompted(beneficiaryTab);
      await investmentDivisionsPage.acceptDivisionAgreement();
      await investmentDivisionsPage.startDivision();

      await investmentDivisionsPage.waitForProposedDivisionCard();
      await investmentDivisionsPage.acceptDivisionAgreement();
      await investmentDivisionsPage.acceptDivision();

      await investmentDivisionsPage.closeDivisionSuccessPopup();
    });

    await test.step('Verify request is awaiting heirs approval', async () => {
      await requestsPage.open();
      await expect(beneficiaryTab).toHaveURL(/\/my-orders/);

      await requestsPage.openCaseDetails();

      await requestsPage.openDivisionsListingTab();
      await expect(investmentDivisionsPage.requestStatus()).toContainText('بانتظار موافقة الورثة');
    });

    await test.step('All heirs approve the division', async () => {
      const heirAcceptance = new HeirAcceptance(seederPage, result, InvestmentDivisionsPage);
      await heirAcceptance.run();

      await expect(async () => {
        await requestsPage.openRequestDataTab();
        //await expect(requestsPage.distributionStatus()).toContainText('في انتظار التدقيق', { timeout: 3000 });
      }).toPass({ timeout: 60_000 });

      await requestsPage.openDivisionsListingTab();

      await investmentDivisionsPage.viewDivision();
    });

    await test.step('Auditor approves the division', async () => {
      await adminPage.bringToFront();
      divisionId = await openDivisionDashboard(adminPage, result.inheritanceId);

      await new InheritanceActionsPage(adminPage).submitAuditorApprove(result.inheritanceId);
    });



  });
});

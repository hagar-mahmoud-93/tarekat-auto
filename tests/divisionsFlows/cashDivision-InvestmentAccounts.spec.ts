import { test, expect } from '../../fixtures/base.fixture';
import { env } from '../../config/env';
import { CashDivisionsPage } from '../../pages/cash-divisions.page';
import { DataPreparation } from '../../steps/data-preparation';
import { DivisionsList } from '../../steps/divisions-list';
import { HeirAcceptance } from '../../steps/heir-acceptance';
import { openDivisionDashboard } from '../../steps/open-division-dashboard';
import { InheritanceActionsPage } from '../../pages/inheritance-actions.page';
import { TarikaFundsStatusClient } from '../../api/clients/tarika-funds-status.client';
import { TarikaDistributeReqClient } from '../../api/clients/tarika-distribute-req.client';
import { fillMobileNumberIfPrompted } from '../../steps/fill-mobile-number';
import { DivisionDashboardPage } from '../../pages/division-dashboard.page';
import { SubmitTarikaFundsResults } from '../../steps/submit-tarika-funds-results';
import { DivisionType } from '../../pages/seeder.page';

test.describe('Inheritance seeder', () => {

  test('Cash division - Investment Accounts @smoke', async ({ seederPage, request, page: adminPage }) => {
    test.setTimeout(300_000); // long multi-stage flow with real backend processing between steps
    test.skip(!env.admin.username || !env.admin.password, 'ADMIN_USERNAME/ADMIN_PASSWORD not set');

    const divisionType: DivisionType = 'cashInvestmentAccounts';

    let result: Awaited<ReturnType<DataPreparation['seedCase']>>['result'];
    let beneficiaryTab: Awaited<ReturnType<DataPreparation['seedCase']>>['beneficiaryTab'];
    let requestsPage: Awaited<ReturnType<DivisionsList['run']>>;
    let cashDivisionsPage: CashDivisionsPage;
    let divisionId: string;
    let divisionDashboardPage: DivisionDashboardPage;

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
      await requestsPage.open();
      await expect(beneficiaryTab).toHaveURL(/\/my-orders/);
      // await expect(requestsPage.requestCard('قسمة التركة')).toContainText('قيد التنفيذ');

      await requestsPage.openCaseDetails();
      // await expect(requestsPage.distributionStatus()).toContainText('بانتظار بدء القسمة');

      await requestsPage.openDivisionsListingTab();
      await expect(cashDivisionsPage.requestStatus()).toContainText('بانتظار موافقة الورثة');
    });

    await test.step('All heirs approve the division', async () => {
      const heirAcceptance = new HeirAcceptance(seederPage, result);
      await heirAcceptance.run();

      await requestsPage.openRequestDataTab();
      await expect(requestsPage.distributionStatus()).toContainText('في انتظار التدقيق');

      await requestsPage.openDivisionsListingTab();
      // await expect(cashDivisionsPage.requestStatus()).toContainText('في انتظار التدقيق');

      await cashDivisionsPage.viewDivision();
    });

    await test.step('Verify bank account inquiry is in progress', async () => {
      await cashDivisionsPage.openBankAccountTab();
      await expect(cashDivisionsPage.inquiryStatus()).toContainText('قيد الاستعلام');
    });

    await test.step('Auditor approves the division', async () => {
      await adminPage.bringToFront();
      divisionId = await openDivisionDashboard(adminPage, result.inheritanceId);

      await new InheritanceActionsPage(adminPage).submitAuditorApprove(result.inheritanceId);
    });

    await test.step('Simulate Tarika funds status and complete heir inquiries and account selection', async () => {
      await new TarikaFundsStatusClient(request).simulate(result, divisionId, divisionType);

      divisionDashboardPage = new DivisionDashboardPage(adminPage);
      await divisionDashboardPage.completeHeirInqs(divisionId, result.heirsCount);

      for (let i = 0; i < result.heirsCount; i++) {
        await expect(divisionDashboardPage.heirInquiryFsmState(i)).not.toContainText('requested');
      }

      await divisionDashboardPage.expireAccountChoosing();
    });

    await test.step('Submit Tarika distribution request and settle funds', async () => {
      await new TarikaDistributeReqClient(request).submitTarikaDistributeRequest(result, divisionId);

      const submitTarikaFundsResults = new SubmitTarikaFundsResults(request, divisionDashboardPage);
      // Tarika funds results are processed in two settlement rounds
      await submitTarikaFundsResults.run(divisionId, result);
      await submitTarikaFundsResults.run(divisionId, result);
    });

    await test.step('Verify division completes successfully', async () => {
      await divisionDashboardPage.open(divisionId);

      await expect(divisionDashboardPage.divisionStatus()).toContainText('COMPLETED');

      await expect(divisionDashboardPage.ejadaStage()).toContainText('COMPLETED');
      await expect(divisionDashboardPage.ejadaStage()).toContainText('COMPLETED');
    });
  });
});
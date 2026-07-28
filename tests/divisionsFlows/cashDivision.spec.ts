import { test, expect } from '../../fixtures/base.fixture';
import { env } from '../../config/env';
import { CashDivisionsPage } from '../../pages/cash-divisions.page';
import { DataPreparation } from '../../steps/data-preparation';
import { DivisionsList } from '../../steps/divisions-list';
import { HeirAcceptance } from '../../steps/heir-acceptance';
import { openDivisionDashboard } from '../../steps/open-division-dashboard';
import { InheritanceActionsPage } from '../../pages/inheritance-actions.page';
import { TarikaFundsStatusClient } from '../../api/clients/cashDivisionAPIs/tarika-funds-status.client';
import { TarikaDistributeReqClient } from '../../api/clients/cashDivisionAPIs/tarika-distribute-req.client';
import { fillMobileNumberIfPrompted } from '../../steps/fill-mobile-number';
import { DivisionDashboardPage } from '../../pages/division-dashboard.page';
import { SubmitTarikaFundsResults } from '../../steps/submit-tarika-funds-results';

test.describe('Inheritance seeder', () => {

  test('Cash division - Bank Accounts @smoke', async ({ seederPage, request, page: adminPage }) => {
    test.setTimeout(300_000); // long multi-stage flow with real backend processing between steps
    test.skip(!env.admin.username || !env.admin.password, 'ADMIN_USERNAME/ADMIN_PASSWORD not set');

    const dataPreparation = new DataPreparation(seederPage, request);
    const { result, beneficiaryTab } = await dataPreparation.seedCase();

    const divisionsList = new DivisionsList(beneficiaryTab, result);
    const requestsPage = await divisionsList.run();

    const cashDivisionsPage = new CashDivisionsPage(beneficiaryTab);
    await cashDivisionsPage.showAssets();
    await fillMobileNumberIfPrompted(beneficiaryTab);
    await cashDivisionsPage.acceptDivisionAgreement();
    await cashDivisionsPage.startDivision();

    await cashDivisionsPage.waitForProposedDivisionCard();
    await cashDivisionsPage.acceptDivisionAgreement();
    await cashDivisionsPage.acceptDivision();

    await cashDivisionsPage.closeDivisionSuccessPopup();

    await requestsPage.open();
    await expect(beneficiaryTab).toHaveURL(/\/my-orders/);
    // await expect(requestsPage.requestCard('قسمة التركة')).toContainText('قيد التنفيذ');

    await requestsPage.openCaseDetails();
    // await expect(requestsPage.distributionStatus()).toContainText('بانتظار بدء القسمة');

    await requestsPage.openDivisionsListingTab();
    await expect(cashDivisionsPage.requestStatus()).toContainText('بانتظار موافقة الورثة');

    const heirAcceptance = new HeirAcceptance(seederPage, result);
    await heirAcceptance.run();

    await requestsPage.openRequestDataTab();
    await expect(requestsPage.distributionStatus()).toContainText('في انتظار التدقيق');

    await requestsPage.openDivisionsListingTab();
    // await expect(cashDivisionsPage.requestStatus()).toContainText('في انتظار التدقيق');

    await cashDivisionsPage.viewDivision();
    await cashDivisionsPage.openBankAccountTab();
    await expect(cashDivisionsPage.inquiryStatus()).toContainText('قيد الاستعلام');

    await adminPage.bringToFront();
    const divisionId = await openDivisionDashboard(adminPage, result.inheritanceId);

    await new InheritanceActionsPage(adminPage).submitAuditorApprove(result.inheritanceId);

    await new TarikaFundsStatusClient(request).simulate(result, divisionId);

    const divisionDashboardPage = new DivisionDashboardPage(adminPage);
    await divisionDashboardPage.completeHeirInqs(divisionId, result.heirsCount);

    for (let i = 0; i < result.heirsCount; i++) {
      await expect(divisionDashboardPage.heirInquiryFsmState(i)).not.toContainText('requested');
    }

    await divisionDashboardPage.expireAccountChoosing();

    await new TarikaDistributeReqClient(request).submitTarikaDistributeRequest(result, divisionId);

    const submitTarikaFundsResults = new SubmitTarikaFundsResults(request, divisionDashboardPage);
    // Tarika funds results are processed in two settlement rounds
    await submitTarikaFundsResults.run(divisionId, result);
    await submitTarikaFundsResults.run(divisionId, result);

    await divisionDashboardPage.open(divisionId);

    await expect(divisionDashboardPage.divisionStatus()).toContainText('COMPLETED');

    await expect(divisionDashboardPage.ejadaStage()).toContainText('COMPLETED');
  });
});
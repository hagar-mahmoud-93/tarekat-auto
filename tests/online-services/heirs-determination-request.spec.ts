import { test, expect } from '../../fixtures/base.fixture';
import { env } from '../../config/env';
import { SeedIdentity, WitnessSeedData } from '../../api/clients/seed-management.client';
import { mockSeedDataPreparation } from '../../steps/mock-seed-data-preparation';
import { nafathLogin } from '../../steps/nafath-login';
import { deleteSeed } from '../../steps/delete-seed';
import { MainMenuPage } from '../../pages/common-pages/main-menu.page';
import { OnlineServicesPage } from '../../pages/online-services-pages/online-services.page';
import { ServiceDetailsPage } from '../../pages/online-services-pages/service-details.page';
import { HeirsDeterminationServiceSelectionPage } from '../../pages/online-services-pages/heirs-determination-service-selection.page';
import { TermsAndConditionsPage } from '../../pages/heirs-determination-pages/terms-and-conditions.page';
import { ApplicantDataPage } from '../../pages/heirs-determination-pages/applicant-data.page';
import { saveAndContinue } from '../../steps/save-and-continue';
import { DeceasedDataPage } from '../../pages/heirs-determination-pages/deceased-data.page';
import { HeirsSelectionPage } from '../../pages/heirs-determination-pages/heirs-selection.page';
import { HeirsListPage } from '../../pages/heirs-determination-pages/heirs-list.page';
import { WitnessDataPage } from '../../pages/heirs-determination-pages/witness-data.page';
import { RequestPreviewPage } from '../../pages/heirs-determination-pages/request-preview.page';
import { MyOrdersPage } from '../../pages/common-pages/my-orders.page';
import { randomMobileNumber } from '../../steps/generate-random-data';

test.describe('Inheritance request', () => {
  test('Inheritance request @inheritance-request', async ({ request, page, loginPage }) => {
    test.setTimeout(120_000); // multi-step wizard flow with real backend processing between steps

    let deceasedIdentity: SeedIdentity;
    let deceasedBirthDateHijri: string;
    let beneficiaryRelationshipType: string;
    let firstWitness: WitnessSeedData;
    let secondWitness: WitnessSeedData;
    let requestNumber: string;

    await test.step('Seed a Tawtheeq case with fresh heir data', async () => {
      ({ deceasedIdentity, deceasedBirthDateHijri, beneficiaryRelationshipType, firstWitness, secondWitness } =
        await mockSeedDataPreparation(request, env.tawtheeq.baseURL));
    });

    await test.step('Nafath login', async () => {
      test.skip(!env.nafath.username || !env.nafath.password, 'NAFATH_USERNAME/NAFATH_PASSWORD not set');

      await nafathLogin(page, loginPage, env.nafath.username, env.nafath.password);
    });

    await test.step('Open الخدمات الإلكترونية from the side menu', async () => {
      const mainMenuPage = new MainMenuPage(page);
      await mainMenuPage.openOnlineServices();

      await expect(page).toHaveURL(/\/online-services/);
    });

    await test.step('Open service details for إصدار حصر الورثة', async () => {
      const onlineServicesPage = new OnlineServicesPage(page);
      await onlineServicesPage.viewServiceDetails('إصدار حصر الورثة');

      await expect(page).toHaveURL(/\/online-services\/heirs-determination-service/);
    });

    await test.step('Start the service', async () => {
      const serviceDetailsPage = new ServiceDetailsPage(page);
      await serviceDetailsPage.startService();

      await expect(page).toHaveURL(/\/online-services\/add-heirs-select-service/);
    });

    await test.step('Select إصدار وثيقة حصر ورثة جديدة', async () => {
      const serviceSelectionPage = new HeirsDeterminationServiceSelectionPage(page);
      await serviceSelectionPage.selectCard('إصدار وثيقة حصر ورثة جديدة');

      await expect(page).toHaveURL(/\/online-services\/terms-and-conditions/);
    });

    await test.step('Agree to the الإقرار terms', async () => {
      const termsAndConditionsPage = new TermsAndConditionsPage(page);
      await termsAndConditionsPage.agree();

      await expect(page).toHaveURL(/\/online-services\/heirs-determination/);
    });

    await test.step('Fill بيانات مقدم الطلب', async () => {
      const applicantDataPage = new ApplicantDataPage(page);
      await applicantDataPage.selectBeneficiaryType('أصالة عن نفسه');
      await applicantDataPage.fillMobileNumber(randomMobileNumber());
      await applicantDataPage.selectPreviousDocumentExists('لا');
    });

    await test.step('Save and continue', async () => {
      await saveAndContinue(page);

      await expect(page.getByText('مراجعة بيانات مقدم الطلب')).toBeVisible();
    });

    await test.step('Save and continue again', async () => {
      await saveAndContinue(page);

      await expect(page.getByText('بيانات الوفاة', { exact: true })).toBeVisible();
    });

    await test.step('Fill بيانات المورّث', async () => {
      const deceasedDataPage = new DeceasedDataPage(page);
      await deceasedDataPage.fillIdNumber(deceasedIdentity.identityNumber);
      await deceasedDataPage.selectIdTypeForIdentityType(deceasedIdentity.identityType);
      await deceasedDataPage.fillBirthDateHijri(deceasedBirthDateHijri);
      await deceasedDataPage.uploadFamilyRegister();
      await deceasedDataPage.uploadDeathCertificate();
      await deceasedDataPage.verify();
    });

    await test.step('Confirm صلة القرابة مع المورث', async () => {
      const deceasedDataPage = new DeceasedDataPage(page);

      if (await deceasedDataPage.isRelationshipDropdownEnabled()) {
        await deceasedDataPage.selectRelationship(beneficiaryRelationshipType);
      }
      await saveAndContinue(page);
    });

    await test.step('Save and continue again', async () => {
      await saveAndContinue(page);

      await expect(page.getByText('احسب عدد الورثة', { exact: true })).toBeVisible();
    });

    await test.step('Fill تحديد الورثة', async () => {
      const heirsSelectionPage = new HeirsSelectionPage(page);
      await heirsSelectionPage.selectNoForAllQuestions();
      await heirsSelectionPage.fillAllCountsWithZero();
      await heirsSelectionPage.fillLivingSonsCount('1');
    });

    await test.step('Calculate عدد الورثة', async () => {
      const heirsSelectionPage = new HeirsSelectionPage(page);
      await heirsSelectionPage.calculateHeirsCount();

      await expect(page.getByText('عدد الورثة المحتسب')).toBeVisible();

      console.log('Heirs count result:', await heirsSelectionPage.getHeirsCountText());
    });

    await test.step('Save and continue again', async () => {
      await saveAndContinue(page);

      await expect(page.getByText('أقرُّ بصحة قائمة الورثة', { exact: false })).toBeVisible();
    });

    await test.step('Acknowledge قائمة الورثة and continue', async () => {
      const heirsListPage = new HeirsListPage(page);

      await heirsListPage.acknowledgeHeirsList();
      await saveAndContinue(page);

      await expect(page.getByText('بيانات الشاهد الأول', { exact: true })).toBeVisible();
    });

    await test.step('Fill بيانات الشاهد الأول', async () => {
      const witnessDataPage = new WitnessDataPage(page);
      await witnessDataPage.selectAnyRelationToDeceased();
      await witnessDataPage.fillMobileNumber(firstWitness.phoneNumber);
      await witnessDataPage.selectIdTypeForIdentityType(firstWitness.identityType);
      await witnessDataPage.fillIdNumber(firstWitness.identityNumber);
      await witnessDataPage.fillBirthDateHijri(firstWitness.birthDateHijri);
    });

    await test.step('Verify بيانات الشاهد الأول', async () => {
      const witnessDataPage = new WitnessDataPage(page);
      await witnessDataPage.verify();
    });

    await test.step('Fill بيانات الشاهد الثاني', async () => {
      const witnessDataPage = new WitnessDataPage(page);
      await witnessDataPage.selectAnyRelationToDeceased();
      await witnessDataPage.fillMobileNumber(secondWitness.phoneNumber);
      await witnessDataPage.selectIdTypeForIdentityType(secondWitness.identityType);
      await witnessDataPage.fillIdNumber(secondWitness.identityNumber);
      await witnessDataPage.fillBirthDateHijri(secondWitness.birthDateHijri);
    });

    await test.step('Verify بيانات الشاهد الثاني', async () => {
      const witnessDataPage = new WitnessDataPage(page);
      await witnessDataPage.verify();
    });

    // حفظ ومتابعة stays disabled for ~1s after تحقق while the backend finishes validating the
    // witness asynchronously; saveAndContinue()'s click retries until it's enabled.
    await test.step('Save and continue', async () => {
      await saveAndContinue(page);

      await expect(page.getByText('معاينة نموذج الطلب', { exact: true })).toBeVisible();
    });

    await test.step('Submit the request', async () => {
      await saveAndContinue(page);
    });

    await test.step('Close the loading popup', async () => {
      const requestPreviewPage = new RequestPreviewPage(page);
      await requestPreviewPage.closeLoadingPopup();
    });

    await test.step('Save طلب حصر الورثة رقم from the confirmation popup', async () => {
      const requestPreviewPage = new RequestPreviewPage(page);
      requestNumber = await requestPreviewPage.getSubmittedRequestNumber();

      console.log('Submitted طلب حصر الورثة رقم:', requestNumber);
    });

    await test.step('View عرض تفاصيل الطلب', async () => {
      const requestPreviewPage = new RequestPreviewPage(page);
      await requestPreviewPage.viewRequestDetails();

      await expect(page.getByText('تم تقديم طلب حصر الورثة رقم', { exact: false })).not.toBeVisible();
    });

    await test.step('Search for طلب حصر الورثة رقم in الطلبات', async () => {
      const mainMenuPage = new MainMenuPage(page);
      await mainMenuPage.openMyOrders();

      await expect(page).toHaveURL(/\/my-orders/);

      const myOrdersPage = new MyOrdersPage(page);
      await myOrdersPage.search(requestNumber);

      await expect(myOrdersPage.requestNumberResult(requestNumber)).toBeVisible();
      await expect(myOrdersPage.deceasedIdentityNumber()).toHaveText(deceasedIdentity.identityNumber);

      // حالة الطلب doesn't live-update once rendered; re-searching re-fetches the card from the
      // backend, so poll it rather than asserting once against a stale DOM snapshot.
      await expect(async () => {
        await myOrdersPage.search(requestNumber);
        await expect(myOrdersPage.orderStatus('حصر الورثة')).toHaveText('تم التنفيذ', { timeout: 2000 });
      }).toPass({ timeout: 90_000 });
    });

    await test.step('Delete the seed', async () => {
      await deleteSeed(request, env.tawtheeq.baseURL, requestNumber);
    });
  });
});

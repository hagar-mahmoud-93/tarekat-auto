import { test, expect } from '../fixtures/base.fixture';
import { env } from '../config/env';
import { GenerateSeedDataClient, SeedIdentity, WitnessSeedData } from '../api/clients/generate-seed-data.client';
import { nafathLogin } from '../steps/nafath-login';
import { MainNavPage } from '../pages/main-nav.page';
import { OnlineServicesPage } from '../pages/online-services.page';
import { ServiceDetailsPage } from '../pages/service-details.page';
import { ServiceSelectionPage } from '../pages/service-selection.page';
import { TermsAndConditionsPage } from '../pages/terms-and-conditions.page';
import { ApplicantDataPage } from '../pages/heirs-determination-pages/applicant-data.page';
import { WizardNavPage } from '../pages/heirs-determination-pages/wizard-nav.page';
import { DeceasedDataPage } from '../pages/heirs-determination-pages/deceased-data.page';
import { HeirsSelectionPage } from '../pages/heirs-determination-pages/heirs-selection.page';
import { HeirsListPage } from '../pages/heirs-determination-pages/heirs-list.page';
import { WitnessDataPage } from '../pages/heirs-determination-pages/witness-data.page';
import { RequestPreviewPage } from '../pages/heirs-determination-pages/request-preview.page';
import { MyOrdersPage } from '../pages/my-orders.page';

function randomMobileNumber(): string {
  let digits = '';
  for (let i = 0; i < 7; i++) digits += Math.floor(Math.random() * 10);
  return `056${digits}`;
}

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
      const generateSeedDataClient = new GenerateSeedDataClient(request, env.tawtheeq.baseURL);
      const {
        response,
        deceasedIdentity: seededDeceasedIdentity,
        deceasedBirthDateHijri: seededDeceasedBirthDateHijri,
        beneficiaryRelationshipType: seededBeneficiaryRelationshipType,
        firstWitness: seededFirstWitness,
        secondWitness: seededSecondWitness,
      } = await generateSeedDataClient.seed();

      expect(response.ok()).toBeTruthy();
      deceasedIdentity = seededDeceasedIdentity;
      deceasedBirthDateHijri = seededDeceasedBirthDateHijri;
      beneficiaryRelationshipType = seededBeneficiaryRelationshipType;
      firstWitness = seededFirstWitness;
      secondWitness = seededSecondWitness;
    });

    await test.step('Nafath login', async () => {
      test.skip(!env.nafath.username || !env.nafath.password, 'NAFATH_USERNAME/NAFATH_PASSWORD not set');

      await nafathLogin(page, loginPage, env.nafath.username, env.nafath.password);
    });

    await test.step('Open الخدمات الإلكترونية from the side menu', async () => {
      const mainNavPage = new MainNavPage(page);
      await mainNavPage.openOnlineServices();

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
      const serviceSelectionPage = new ServiceSelectionPage(page);
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
      await applicantDataPage.selectRelationToInheritor('أصالة عن نفسه');
      await applicantDataPage.fillMobileNumber(randomMobileNumber());
      await applicantDataPage.selectPreviousDocumentExists('لا');
    });

    await test.step('Save and continue', async () => {
      const wizardNavPage = new WizardNavPage(page);
      await wizardNavPage.saveAndContinue();

      await expect(page.getByText('مراجعة بيانات مقدم الطلب')).toBeVisible();
    });

    await test.step('Save and continue again', async () => {
      const wizardNavPage = new WizardNavPage(page);
      await wizardNavPage.saveAndContinue();

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
      const wizardNavPage = new WizardNavPage(page);

      if (await deceasedDataPage.isRelationshipDropdownEnabled()) {
        await deceasedDataPage.selectRelationship(beneficiaryRelationshipType);
      }
      await wizardNavPage.saveAndContinue();
    });

    await test.step('Save and continue again', async () => {
      const wizardNavPage = new WizardNavPage(page);
      await wizardNavPage.saveAndContinue();

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
      const wizardNavPage = new WizardNavPage(page);
      await wizardNavPage.saveAndContinue();

      await expect(page.getByText('أقرُّ بصحة قائمة الورثة', { exact: false })).toBeVisible();
    });

    await test.step('Acknowledge قائمة الورثة and continue', async () => {
      const heirsListPage = new HeirsListPage(page);
      const wizardNavPage = new WizardNavPage(page);

      await heirsListPage.acknowledgeHeirsList();
      await wizardNavPage.saveAndContinue();

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
    // witness asynchronously; wizardNavPage.saveAndContinue()'s click retries until it's enabled.
    await test.step('Save and continue', async () => {
      const wizardNavPage = new WizardNavPage(page);
      await wizardNavPage.saveAndContinue();

      await expect(page.getByText('معاينة نموذج الطلب', { exact: true })).toBeVisible();
    });

    await test.step('Submit the request', async () => {
      const wizardNavPage = new WizardNavPage(page);
      await wizardNavPage.saveAndContinue();
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
      const mainNavPage = new MainNavPage(page);
      await mainNavPage.openMyOrders();

      await expect(page).toHaveURL(/\/my-orders/);

      const myOrdersPage = new MyOrdersPage(page);
      await myOrdersPage.search(requestNumber);

      await expect(myOrdersPage.requestNumberResult(requestNumber)).toBeVisible();
    });
  });
});

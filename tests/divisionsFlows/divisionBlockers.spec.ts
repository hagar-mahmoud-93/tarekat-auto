import { test, expect } from '../../fixtures/base.fixture';
import { env } from '../../config/env';
import { CashDivisionsPage } from '../../pages/cash-divisions.page';
import { InvestmentDivisionsPage } from '../../pages/investment-divisions.page';
import { DataPreparation } from '../../steps/data-preparation';
import { DivisionsList } from '../../steps/divisions-list';
import { fillMobileNumberIfPrompted } from '../../steps/fill-mobile-number';

test.describe('Division blockers', () => {

  test('Cash division is blocked when a heir is a minor @division @cash-division', async ({ seederPage, request }) => {
    test.setTimeout(120_000);
    test.skip(!env.admin.username || !env.admin.password, 'ADMIN_USERNAME/ADMIN_PASSWORD not set');

    let result: Awaited<ReturnType<DataPreparation['seedCase']>>['result'];
    let beneficiaryTab: Awaited<ReturnType<DataPreparation['seedCase']>>['beneficiaryTab'];
    let cashDivisionsPage: CashDivisionsPage;

    await test.step('Seed a case with one minor heir and open the divisions listing', async () => {
      const dataPreparation = new DataPreparation(seederPage, request);
      ({ result, beneficiaryTab } = await dataPreparation.seedCase(undefined, { minorHeirIndex: 1 }));

      expect(result.json.heirs.some((heir) => heir.isMinor)).toBeTruthy();

      const divisionsList = new DivisionsList(beneficiaryTab, result);
      await divisionsList.run();

      cashDivisionsPage = new CashDivisionsPage(beneficiaryTab);
    });

    await test.step('Beneficiary attempts to start the cash division and is blocked', async () => {
      await cashDivisionsPage.showAssets();
      await fillMobileNumberIfPrompted(beneficiaryTab);
      await cashDivisionsPage.acceptDivisionAgreement();
      await cashDivisionsPage.startDivision();

      await expect(cashDivisionsPage.blockerDialog()).toBeVisible();
      await expect(cashDivisionsPage.blockerDialog()).toContainText('قاصر');
    });
  });

  test('Investment division is blocked when a heir is a minor @division @investment-division', async ({ seederPage, request }) => {
    test.setTimeout(120_000);
    test.skip(!env.admin.username || !env.admin.password, 'ADMIN_USERNAME/ADMIN_PASSWORD not set');

    let result: Awaited<ReturnType<DataPreparation['seedCase']>>['result'];
    let beneficiaryTab: Awaited<ReturnType<DataPreparation['seedCase']>>['beneficiaryTab'];
    let investmentDivisionsPage: InvestmentDivisionsPage;

    await test.step('Seed a case with one minor heir and open the divisions listing', async () => {
      const dataPreparation = new DataPreparation(seederPage, request);
      ({ result, beneficiaryTab } = await dataPreparation.seedCase(undefined, { minorHeirIndex: 1 }));

      expect(result.json.heirs.some((heir) => heir.isMinor)).toBeTruthy();

      const divisionsList = new DivisionsList(beneficiaryTab, result);
      await divisionsList.run();

      investmentDivisionsPage = new InvestmentDivisionsPage(beneficiaryTab);
    });

    await test.step('Beneficiary attempts to start the investment division and is blocked', async () => {
      await investmentDivisionsPage.showAssets();
      await fillMobileNumberIfPrompted(beneficiaryTab);
      await investmentDivisionsPage.acceptDivisionAgreement();
      await investmentDivisionsPage.startDivision();

      await expect(investmentDivisionsPage.blockerDialog()).toBeVisible();
      await expect(investmentDivisionsPage.blockerDialog()).toContainText('قاصر');
    });
  });

  test('Cash division is blocked when a heir is dead @division @cash-division', async ({ seederPage, request }) => {
    test.setTimeout(120_000);
    test.skip(!env.admin.username || !env.admin.password, 'ADMIN_USERNAME/ADMIN_PASSWORD not set');

    let result: Awaited<ReturnType<DataPreparation['seedCase']>>['result'];
    let beneficiaryTab: Awaited<ReturnType<DataPreparation['seedCase']>>['beneficiaryTab'];
    let cashDivisionsPage: CashDivisionsPage;

    await test.step('Seed a case with one dead heir and open the divisions listing', async () => {
      const dataPreparation = new DataPreparation(seederPage, request);
      ({ result, beneficiaryTab } = await dataPreparation.seedCase(undefined, { deadHeirIndex: 1 }));

      expect(result.json.heirs.some((heir) => heir.isDead)).toBeTruthy();

      const divisionsList = new DivisionsList(beneficiaryTab, result);
      await divisionsList.run();

      cashDivisionsPage = new CashDivisionsPage(beneficiaryTab);
    });

    await test.step('Beneficiary attempts to start the cash division and is blocked', async () => {
      await cashDivisionsPage.showAssets();
      await fillMobileNumberIfPrompted(beneficiaryTab);
      await cashDivisionsPage.acceptDivisionAgreement();
      await cashDivisionsPage.startDivision();

      await expect(cashDivisionsPage.blockerDialog()).toBeVisible();
      await expect(cashDivisionsPage.blockerDialog()).toContainText('يجب وجود حصر ورثة للوارث المتوفى');
    });
  });

  test('Investment division is blocked when a heir is dead @division @investment-division', async ({ seederPage, request }) => {
    test.setTimeout(120_000);
    test.skip(!env.admin.username || !env.admin.password, 'ADMIN_USERNAME/ADMIN_PASSWORD not set');

    let result: Awaited<ReturnType<DataPreparation['seedCase']>>['result'];
    let beneficiaryTab: Awaited<ReturnType<DataPreparation['seedCase']>>['beneficiaryTab'];
    let investmentDivisionsPage: InvestmentDivisionsPage;

    await test.step('Seed a case with one dead heir and open the divisions listing', async () => {
      const dataPreparation = new DataPreparation(seederPage, request);
      ({ result, beneficiaryTab } = await dataPreparation.seedCase(undefined, { deadHeirIndex: 1 }));

      expect(result.json.heirs.some((heir) => heir.isDead)).toBeTruthy();

      const divisionsList = new DivisionsList(beneficiaryTab, result);
      await divisionsList.run();

      investmentDivisionsPage = new InvestmentDivisionsPage(beneficiaryTab);
    });

    await test.step('Beneficiary attempts to start the investment division and is blocked', async () => {
      await investmentDivisionsPage.showAssets();
      await fillMobileNumberIfPrompted(beneficiaryTab);
      await investmentDivisionsPage.acceptDivisionAgreement();
      await investmentDivisionsPage.startDivision();

      await expect(investmentDivisionsPage.blockerDialog()).toBeVisible();
      await expect(investmentDivisionsPage.blockerDialog()).toContainText(
        'نحيطكم بأنه لا يمكن القسمة الاتفاقية للتركة من خلال منصة التركات',
      );
    });
  });
});

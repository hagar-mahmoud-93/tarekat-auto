import { test, expect } from '../../fixtures/base.fixture';
import { env } from '../../config/env';
import { DataPreparation } from '../../steps/data-preparation';
import { ProfileLocators } from '../../locators/profile.locators';

test.describe('Profile - Bank account information', () => {
  test('Heir views and adds bank account information @profile', async ({ seederPage, request }) => {
    test.skip(!env.admin.username || !env.admin.password, 'ADMIN_USERNAME/ADMIN_PASSWORD not set');

    const dataPreparation = new DataPreparation(seederPage, request);
    const { result, beneficiaryTab } = await dataPreparation.seedCase();
    await beneficiaryTab.close();

    // Log in as one of the seeded heirs (not the beneficiary) to test the profile flow from a heir's session.
    const otherHeirs = result.json.heirs.filter(
      (heir) => heir.identityNumber !== result.json.beneficiary.identityNumber,
    );
    const heirTab = await seederPage.loginAsUser(otherHeirs[0].identityNumber);
    const locators = new ProfileLocators(heirTab);

    await test.step('Navigate to الملف الشخصي from the side navigator', async () => {
      await locators.profileNavLink().click();
      await heirTab.waitForLoadState('networkidle').catch(() => {});

      // A first-time heir login gets redirected instead to /state-inventory-service/create-estate
      // (a "تقديم طلب حصر ورثة جديد" prompt, unrelated to profile) on this first click. Dismissing
      // that dialog and clicking the nav link again lands on the actual profile page.
      //
      // The dialog's own redirect can detach the cancel button mid-click, which makes Playwright's
      // detached-element retry loop spin past the default 30s test timeout. Bound each click with
      // its own short timeout and swallow the failure — the outer basicDataHeading() assertion
      // below is what actually verifies we made it to the profile page.
      const cancelButton = locators.newUserEstateDialogCancelButton();
      if (await cancelButton.isVisible().catch(() => false)) {
        await cancelButton.click({ timeout: 5000 }).catch(() => {});
        await heirTab.waitForLoadState('networkidle').catch(() => {});
        await locators.profileNavLink().click({ timeout: 5000 }).catch(() => {});
        await heirTab.waitForLoadState('networkidle').catch(() => {});
      }

      await expect(locators.basicDataHeading()).toBeVisible();
    });

    await test.step('Open بيانات الحساب البنكي tab', async () => {
      await locators.bankAccountsTabButton().click();
      await heirTab.waitForLoadState('networkidle').catch(() => {});

      await expect(locators.bankAccountsHeading()).toBeVisible();
    });

    await test.step('Leaving the field empty and pressing تحقق shows no validation error (silent no-op, button stays enabled)', async () => {
      await locators.ibanInput().fill('');
      await expect(locators.verifyIbanButton()).toBeEnabled();
      await locators.verifyIbanButton().click();

      await expect(locators.ibanValidationError()).toBeHidden();
    });

    // Every one of these is rejected by the same "24 characters, starts with SA" rule — verified
    // via the shared field validation error rather than one-off assertions per shape. Note the
    // check is on shape only: it doesn't require the 22 characters after "SA" to be digits (see
    // the separate "non-numeric IBAN" test below for that gap).
    const invalidIbans = [
      { label: 'far too short', value: '123' },
      { label: '23 characters (one short of 24), correctly SA-prefixed', value: 'SA123456789012345678901' },
      { label: '25 characters (one over 24), correctly SA-prefixed', value: 'SA12345678901234567890123' },
      { label: '24 characters not starting with SA', value: 'XX1234567890123456789012' },
      { label: 'lowercase "sa" prefix (24 characters, otherwise valid shape)', value: 'sa1234567890123456789012' },
    ];

    for (const { label, value } of invalidIbans) {
      await test.step(`Entering an IBAN with ${label} shows the field validation error`, async () => {
        await locators.ibanInput().fill(value);
        await locators.verifyIbanButton().click();

        await expect(locators.ibanValidationError()).toBeVisible();
      });
    }

    await test.step('Entering a valid IBAN adds the bank account', async () => {
      const iban = result.json.estateAssets.bankAccounts![0].iban;
      await locators.ibanInput().fill(iban);
      await locators.verifyIbanButton().click();

      await expect(locators.ibanAddedSuccessMessage()).toBeVisible();
      await expect(locators.primaryAccountLabel()).toBeVisible();
    });

    await heirTab.close();
  });

  // Isolated in its own test (own seed/session) rather than appended to the happy-path test above,
  // since it deliberately adds a bogus account and shouldn't affect that test's IBAN-add assertion.
  test('IBAN validation only checks shape, not that the account digits are numeric @profile', async ({
    seederPage,
    request,
  }) => {
    test.skip(!env.admin.username || !env.admin.password, 'ADMIN_USERNAME/ADMIN_PASSWORD not set');

    const dataPreparation = new DataPreparation(seederPage, request);
    const { result, beneficiaryTab } = await dataPreparation.seedCase();
    await beneficiaryTab.close();

    const otherHeirs = result.json.heirs.filter(
      (heir) => heir.identityNumber !== result.json.beneficiary.identityNumber,
    );
    const heirTab = await seederPage.loginAsUser(otherHeirs[0].identityNumber);
    const locators = new ProfileLocators(heirTab);

    await locators.profileNavLink().click();
    await heirTab.waitForLoadState('networkidle').catch(() => {});
    const cancelButton = locators.newUserEstateDialogCancelButton();
    if (await cancelButton.isVisible().catch(() => false)) {
      await cancelButton.click({ timeout: 5000 }).catch(() => {});
      await heirTab.waitForLoadState('networkidle').catch(() => {});
      await locators.profileNavLink().click({ timeout: 5000 }).catch(() => {});
      await heirTab.waitForLoadState('networkidle').catch(() => {});
    }
    await locators.bankAccountsTabButton().click();
    await heirTab.waitForLoadState('networkidle').catch(() => {});

    // "SA" + 22 letters — right prefix, right length (24), but not a real IBAN's digit account
    // number. The field validation only checks shape (SA prefix + 24 characters), so this is
    // currently accepted and added as if it were a valid account. Flagging via this test so it's
    // caught the day someone tightens the check to also require digits after "SA".
    await locators.ibanInput().fill('SAABCDEFGHIJKLMNOPQRSTUV');
    await locators.verifyIbanButton().click();

    await expect(locators.ibanAddedSuccessMessage()).toBeVisible();
    await expect(locators.primaryAccountLabel()).toBeVisible();

    await heirTab.close();
  });
});

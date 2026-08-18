import { test, expect } from '../../fixtures/base.fixture';
import { env } from '../../config/env';
import { DataPreparation } from '../../steps/inheritance-seeder-data-preparation';
import { ProfileLocators } from '../../locators/profile.locators';

test.describe('Profile - Mobile number', () => {
  test('Heir logs in and views their profile @profile', async ({ seederPage, request }) => {
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

    await test.step('Opening the الجوال editor pre-fills the current number', async () => {
      await locators.mobileFieldEditButton().click();
      await expect(locators.mobileNumberInput()).not.toBeEmpty();
    });

    await test.step('Clearing the field and saving shows no validation error (silent no-op, save button stays enabled)', async () => {
      await locators.mobileNumberInput().fill('');
      await expect(locators.saveMobileButton()).toBeEnabled();
      await locators.saveMobileButton().click();

      await expect(locators.mobileNumberValidationError()).toBeHidden();
    });

    // Every one of these is rejected by the same "(05) + 10 digits" rule — verified via the
    // shared field validation error rather than one-off assertions per shape.
    const invalidMobileNumbers = [
      { label: 'fewer than 10 digits (9, correctly 05-prefixed)', value: '051234567' },
      { label: 'more than 10 digits (11, correctly 05-prefixed)', value: '05123456789' },
      { label: '10 digits not starting with 05 (starts with 55)', value: '5512345678' },
      { label: '10 digits starting with 04 instead of 05', value: '0412345678' },
      { label: 'international format (966 prefix)', value: '966512345678' },
      { label: 'non-numeric input', value: 'abcdefghij' },
    ];

    for (const { label, value } of invalidMobileNumbers) {
      await test.step(`Entering ${label} shows the field validation error`, async () => {
        await locators.mobileNumberInput().fill(value);
        await locators.saveMobileButton().click();

        await expect(locators.mobileNumberValidationError()).toBeVisible();
      });
    }

    await test.step('Entering a 05-prefixed 10-digit number clears the validation error', async () => {
      // Randomized rather than a fixed literal so repeated runs don't collide with a number
      // already assigned to a different heir from an earlier seed.
      const validNumber = '05' + String(Math.floor(10_000_000 + Math.random() * 90_000_000));
      await locators.mobileNumberInput().fill(validNumber);
      await locators.saveMobileButton().click();

      await expect(locators.mobileNumberValidationError()).toBeHidden();
    });

    await heirTab.close();
  });
});

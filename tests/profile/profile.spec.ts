import { test, expect } from '../../fixtures/base.fixture';
import { env } from '../../config/env';
import { DataPreparation } from '../../steps/data-preparation';
import { ProfileLocators } from '../../locators/profile.locators';

test.describe('Profile', () => {
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

    await test.step('Entering a number that doesn\'t start with 05 shows the field validation error', async () => {
      await locators.mobileFieldEditButton().click();
      await locators.mobileNumberInput().fill('5512345678');
      await locators.saveMobileButton().click();

      await expect(locators.mobileNumberValidationError()).toBeVisible();
    });

    await test.step('Entering a 05-prefixed 10-digit number clears the validation error', async () => {
      await locators.mobileNumberInput().fill('0512345678');
      await locators.saveMobileButton().click();

      await expect(locators.mobileNumberValidationError()).toBeHidden();
    });
  });
});

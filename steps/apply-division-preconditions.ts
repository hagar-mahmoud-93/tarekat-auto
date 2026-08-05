import { Page } from '@playwright/test';
import { SeederPage } from '../pages/seeder.page';
import { AdminLoginPage } from '../pages/admin-login.page';
import { AdminIsMockDisabledPage } from '../pages/division-preconditions-pages/admin-is-mock-disabled.page';
import { ConfigurationsServicePage } from '../pages/division-preconditions-pages/configurations-service.page';
import { WaffleFlagsPage } from '../pages/division-preconditions-pages/waffle-flags.page';

/** Waffle flags that must exist and be forced on (Everyone = Yes) for division v2 flows. */
const REQUIRED_WAFFLE_FLAGS = [
  'FE_DIVISION_CASH_V2',
  'FE_DIVISION_INVESTMENT_V2',
  'investment_division_v2_enabled',
  'division_v2_enabled',
];

/**
 * Precondition for division flow tests: enables the inheritance settings toggle (id 8),
 * activates all mock services under configurations/service/, ensures the division v2 waffle
 * flags exist (creating any that are missing) and forces them on for everyone, then opens the
 * seeder tool.
 */
export async function applyDivisionPreconditions(seederPage: SeederPage, adminPage: Page) {
  const adminLoginPage = new AdminLoginPage(adminPage);
  await adminLoginPage.open();

  const adminIsMockDisabledPage = new AdminIsMockDisabledPage(adminPage);
  await adminIsMockDisabledPage.disableValue();

  const configurationsServicePage = new ConfigurationsServicePage(adminPage);
  await configurationsServicePage.open();
  await configurationsServicePage.showAll();
  await configurationsServicePage.checkAllMockActive();

  const waffleFlagsPage = new WaffleFlagsPage(adminPage);
  await waffleFlagsPage.open();
  for (const flagName of REQUIRED_WAFFLE_FLAGS) {
    if (await waffleFlagsPage.hasFlag(flagName)) {
      await waffleFlagsPage.openFlag(flagName);
    } else {
      await waffleFlagsPage.openAddForm();
      await waffleFlagsPage.fillName(flagName);
    }
    await waffleFlagsPage.setEveryoneToYesAndSave();
  }

  await seederPage.login();
}

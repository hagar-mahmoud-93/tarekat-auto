import { test, expect } from '../../fixtures/base.fixture';
import { env } from '../../config/env';

test.describe('Nafath login', () => {
  test('logs in with valid Nafath credentials @regression @nafith-login', async ({ page, loginPage }) => {
    test.skip(!env.nafath.username || !env.nafath.password, 'NAFATH_USERNAME/NAFATH_PASSWORD not set');

    await loginPage.goto();
    await loginPage.loginWithNafath(env.nafath.username, env.nafath.password);

    await expect(page).not.toHaveURL(/\/login/);
  });
});

import { test } from '../../fixtures/base.fixture';
import { env } from '../../config/env';
import { nafathLogin } from '../../steps/nafath-login';

test.describe('Nafath login', () => {
  test('logs in with valid Nafath credentials @regression @nafith-login', async ({ page, loginPage }) => {
    test.skip(!env.nafath.username || !env.nafath.password, 'NAFATH_USERNAME/NAFATH_PASSWORD not set');

    await nafathLogin(page, loginPage, env.nafath.username, env.nafath.password);
  });
});

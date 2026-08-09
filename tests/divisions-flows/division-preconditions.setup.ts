import { test } from '../../fixtures/base.fixture';
import { env } from '../../config/env';
import { applyDivisionPreconditions } from '../../steps/apply-division-preconditions';

test('apply division flow preconditions', async ({ seederPage, page }) => {
  test.skip(!env.admin.username || !env.admin.password, 'ADMIN_USERNAME/ADMIN_PASSWORD not set');
  await applyDivisionPreconditions(seederPage, page);
});

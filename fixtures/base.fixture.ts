
import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/common-pages/login.page';
import { SeederPage } from '../pages/admin-pages/seeder.page';

type Fixtures = {
  loginPage: LoginPage;
  seederPage: SeederPage;
  networkErrorLog: void;
};

type NetworkErrorEntry = {
  method: string;
  url: string;
  status?: number;
  statusText?: string;
  failure?: string;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  seederPage: async ({ page }, use) => {
    await use(new SeederPage(page));
  },
  // Attaches failed/4xx-5xx requests to the test report so a failing test's likely backend
  // cause is visible without opening the full trace. Runs for every test (auto: true).
  networkErrorLog: [async ({ page }, use, testInfo) => {
    const errors: NetworkErrorEntry[] = [];

    page.on('requestfailed', (request) => {
      errors.push({
        method: request.method(),
        url: request.url(),
        failure: request.failure()?.errorText,
      });
    });

    page.on('response', (response) => {
      if (response.status() >= 400) {
        errors.push({
          method: response.request().method(),
          url: response.url(),
          status: response.status(),
          statusText: response.statusText(),
        });
      }
    });

    await use();

    if (testInfo.status !== testInfo.expectedStatus && errors.length > 0) {
      await testInfo.attach('network-errors', {
        body: JSON.stringify(errors, null, 2),
        contentType: 'application/json',
      });
    }
  }, { auto: true }],
});

export { expect } from '@playwright/test';

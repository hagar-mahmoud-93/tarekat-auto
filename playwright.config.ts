import { defineConfig, devices } from '@playwright/test';
import { env } from './config/env';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Drop {platform} from the default template: CI (ubuntu) is the only place toHaveScreenshot()
   * baselines actually gate anything, so a single baseline per test/arg avoids macOS-authored
   * snapshots (suffixed -darwin) silently never matching on the ubuntu-latest runner. */
  snapshotPathTemplate: '{snapshotDir}/{testFileDir}/{testFileName}-snapshots/{arg}-{projectName}{ext}',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Use half the runner's cores on CI instead of forcing a single worker, so fullyParallel
   * actually runs test files concurrently there too. */
  workers: process.env.CI ? '50%' : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters
   * On CI: 'list' prints live per-test pass/fail to the raw Action log (silent otherwise with
   * just 'html'), 'github' turns failures into inline annotations on the PR/Checks page, 'json'
   * feeds the pass/fail/skipped/flaky counts into the Slack notification step. */
  reporter: process.env.CI
    ? [
        ['list'],
        ['github'],
        ['allure-playwright', { outputFolder: 'allure-results', suiteTitle: false, detail: true }],
        ['json', { outputFile: 'test-results/results.json' }],
      ]
    : 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: env.baseURL,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    /* Capture a screenshot for failed tests, attached to the HTML report. */
    screenshot: 'only-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    // {
    //   name: 'chromium',
    //   use: { ...devices['Desktop Chrome'] },
    // },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },

    /* Runs the shared admin preconditions (settings/mocks/waffle flags) exactly once, only when
     * a divisionsFlows test is actually part of the run — see 'divisionsFlows' dependency below. */
    {
      name: 'division-preconditions',
      testDir: './tests/divisions-flows',
      testMatch: /.*\.setup\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        headless: !!process.env.CI,
        // Headless has no real window to maximize, so CI gets a fixed full-HD viewport instead of
        // --start-maximized; toHaveScreenshot() baselines are recorded at this size to match.
        ...(process.env.CI
          ? { viewport: { width: 1920, height: 1080 } }
          : { viewport: null, deviceScaleFactor: undefined, launchOptions: { args: ['--start-maximized'] } }),
      },
    },
    {
      name: 'divisionsFlows',
      testDir: './tests/divisions-flows',
      testIgnore: /.*\.setup\.ts/,
      dependencies: ['division-preconditions'],
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        headless: !!process.env.CI,
        // Headless has no real window to maximize, so CI gets a fixed full-HD viewport instead of
        // --start-maximized; toHaveScreenshot() baselines are recorded at this size to match.
        ...(process.env.CI
          ? { viewport: { width: 1920, height: 1080 } }
          : { viewport: null, deviceScaleFactor: undefined, launchOptions: { args: ['--start-maximized'] } }),
      },
    },
    {
      name: 'Google Chrome',
      testDir: './tests',
      testIgnore: /divisions-flows[\\/]/,
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        headless: !!process.env.CI,
        // Headless has no real window to maximize, so CI gets a fixed full-HD viewport instead of
        // --start-maximized; toHaveScreenshot() baselines are recorded at this size to match.
        ...(process.env.CI
          ? { viewport: { width: 1920, height: 1080 } }
          : { viewport: null, deviceScaleFactor: undefined, launchOptions: { args: ['--start-maximized'] } }),
      },
    },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});

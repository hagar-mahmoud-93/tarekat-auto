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
   * just 'html'), 'github' turns failures into inline annotations on the PR/Checks page. */
  reporter: process.env.CI ? [['list'], ['github'], ['html']] : 'html',
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
      testDir: './tests/divisionsFlows',
      testMatch: /.*\.setup\.ts/,
      use: { ...devices['Desktop Chrome'], channel: 'chrome', headless: !!process.env.CI },
    },
    {
      name: 'divisionsFlows',
      testDir: './tests/divisionsFlows',
      testIgnore: /.*\.setup\.ts/,
      dependencies: ['division-preconditions'],
      use: { ...devices['Desktop Chrome'], channel: 'chrome', headless: !!process.env.CI },
    },
    {
      name: 'Google Chrome',
      testDir: './tests',
      testIgnore: /divisionsFlows[\\/]/,
      use: { ...devices['Desktop Chrome'], channel: 'chrome', headless: !!process.env.CI },
    },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});

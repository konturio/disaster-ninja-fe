import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import { LogLevel } from '@slack/web-api/dist/index.js';
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */

dotenv.config({
  path: ['.env.playwright.production', '.env.playwright.local', '.env.playwright'],
});

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  globalTimeout: process.env.CI ? 1800000 : 600000,
  timeout: process.env.CI ? 120000 : 60000,
  expect: {
    timeout: process.env.CI ? 10000 : 7000,
  },
  testDir: './e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 1,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 4 : 6,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    [
      './node_modules/playwright-slack-report/dist/src/SlackReporter.js',
      {
        channels: ['health_check'], // provide one or more Slack channels
        sendResults: 'always', // "always" , "on-failure", "off"
        maxNumberOfFailuresToShow: 100,
        meta: [
          {
            key: `Tests launched 🎬`,
            value: `${process.env.CI ? 'Github Actions 🐌' : 'Locally'}`,
          },
          {
            key: `Environment 👷🏻‍♂️`,
            value: `${process.env.ENVIRONMENT?.toUpperCase()}`,
          },
          {
            key: `Application 📲`,
            value: `${process.env.APP_NAME?.toUpperCase()}`,
          },
          {
            key: 'Tested user with no rights',
            value: process.env.EMAIL,
          },
          {
            key: `HTML Results 📈`,
            value: '<https://konturtestplaywright.surge.sh/|(see)>',
          },
          {
            key: `Note`,
            value:
              'HTML results are updated only when tests are run from GitHub Actions. ✋ After each run, the report is refreshed. ♻️ For previous reports, go to Workflow runs (below) -> Any workflow run -> Artifacts 🕵️',
          },
          {
            key: `Workflow runs 🦾`,
            value:
              '<https://github.com/konturio/disaster-ninja-fe/actions/workflows/run_e2e_tests.yml|(see)>',
          },
        ],
        slackOAuthToken: process.env.SLACK_BOT_USER_OAUTH_TOKEN,
        slackLogLevel: LogLevel.DEBUG,
        disableUnfurl: true,
        showInThread: true,
      },
    ],
    ['html'], // other reporters
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    ignoreHTTPSErrors: true,
    trace: 'on-first-retry',
    actionTimeout: process.env.CI ? 15000 : 10000,
    navigationTimeout: process.env.CI ? 20000 : 10000,
    viewport: { width: 1280, height: 720 },
    screenshot: 'only-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'setup',
      testMatch: 'auth.setup.ts',
    },
    {
      name: 'setup_pro',
      testMatch: 'authAsPro.setup.ts',
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: [/WithUser/, /WithPro/],
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      testIgnore: [/WithUser/, 'location.spec.ts', /WithPro/],
    },

    {
      name: 'chromium_logged_in',
      use: { ...devices['Desktop Chrome'], storageState: 'e2e/.auth/user.json' },
      dependencies: ['setup'],
      testMatch: /WithUser/,
    },

    {
      name: 'webkit_logged_in',
      use: { ...devices['Desktop Safari'], storageState: 'e2e/.auth/user.json' },
      dependencies: ['setup'],
      testMatch: /WithUser/,
    },
    {
      name: 'chromium_pro',
      use: { ...devices['Desktop Chrome'], storageState: 'e2e/.auth/user-pro.json' },
      dependencies: ['setup_pro'],
      testMatch: /WithPro/,
    },
    {
      name: 'webkit_pro',
      use: { ...devices['Desktop Safari'], storageState: 'e2e/.auth/user-pro.json' },
      dependencies: ['setup_pro'],
      testMatch: /WithPro/,
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
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
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'pnpm dev',
  //   url: 'https://localhost:3000/',
  //   reuseExistingServer: !process.env.CI,
  //   stdout: 'pipe',
  //   timeout: 30000
  // },
});

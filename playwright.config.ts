import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
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
  timeout: process.env.CI ? 60000 : 30000,
  expect: {
    timeout: process.env.CI ? 10000 : 5000,
  },
  testDir: './e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 4 : 6,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    ignoreHTTPSErrors: true,
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
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

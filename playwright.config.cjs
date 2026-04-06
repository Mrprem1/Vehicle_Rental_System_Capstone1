const path = require('path');
const { defineConfig, devices } = require('@playwright/test');

/** @type {import('@playwright/test').PlaywrightTestConfig} */
module.exports = defineConfig({
  testDir: path.join(__dirname, 'tests', 'playwright', 'specs'),

    timeout: 90_000,

  expect: {
    timeout: 20000,
  },

  fullyParallel: true,

  forbidOnly: false,

  retries: 2,

  workers: process.env.CI ? 2 : undefined,

  reporter: [
    ['list'],
    [
      'html',
      {
        outputFolder: path.join(__dirname, 'reports/html-report'),
        open: 'never',
      },
    ],
    [
      'allure-playwright',
      {
        resultsDir: path.join(__dirname, 'reports/allure-results'),
      },
    ],
  ],

  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off',
  },

  projects: [
    {
      name: 'Chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'Firefox',
      use: {
        ...devices['Desktop Firefox'],
      },
    },
    {
      name: 'WebKit',
      use: {
        ...devices['Desktop Safari'],
      },
    },
  ],

  globalSetup: path.join(
    __dirname,
    'tests',
    'playwright',
    'global-setup.cjs'
  ),

  webServer: {
    command: 'node server/index.js',
    cwd: __dirname,
    url: 'http://localhost:3000/api/health',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
import { defineConfig, devices } from '@playwright/test';
import { getConfig } from './config/environment.js';

const envConfig = getConfig();

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.js',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: 30000,

  expect: {
    timeout: 5000
  },

  reporter: process.env.CI
  ? [
      ['html', {
        outputFolder: 'reports/html',
        open: 'never'
      }],
      ['blob', { outputDir: 'blob-report' }],
      ['list'],
      ['junit', { outputFile: 'reports/results.xml' }]
    ]
  : [
      ['html', {
        outputFolder: 'reports/html',
        open: 'never'
      }],
      ['json', { outputFile: 'reports/results.json' }],
      ['junit', { outputFile: 'reports/results.xml' }],
      ['list']
    ],
  use: {
    baseURL: envConfig.baseURL,
    headless: true,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  // webServer: {
  //   command: 'npm run dev',
  //   url: envConfig.baseURL,
  //   reuseExistingServer: !process.env.CI,
  // },
});

// playwright.config.js
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  expect: { 
    timeout: 10 * 1000 
  },
  fullyParallel: true,
  
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list']
  ],

  use: {
    // Pega a URL base do arquivo .env correspondente (ex: /index_dev.html)
    baseURL: process.env.BASE_URL,
    headless: true,
    screenshot: 'on',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        launchOptions: {
          slowMo: 100, 
        }
      },
    },
  ],
});
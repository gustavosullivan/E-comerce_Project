const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:8081',
    headless: false,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
});
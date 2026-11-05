import { defineConfig, devices } from '@playwright/test'

/**
 * SLOT pet-project Playwright config
 *
 * Before tests:
 *   terminal 1: cd server && npm run dev   (:3001)
 *   terminal 2: npm run dev               (Vite, usually :5173)
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  timeout: 60_000,
  expect: { timeout: 15_000 },

  use: {
    baseURL: process.env.SLOT_CLIENT_URL || 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'api',
      testMatch: /tests\/api\/.*\.spec\.ts/,
      use: {
        // API tests use request fixture only
      },
    },
    {
      name: 'e2e-chromium',
      testMatch: /tests\/e2e\/.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Optional: auto-start Vite. Server on :3001 still start manually
  // (API + user persistence live there).
  // webServer: {
  //   command: 'npm run dev',
  //   url: 'http://localhost:5173',
  //   reuseExistingServer: !process.env.CI,
  // },
})

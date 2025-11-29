import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
    timeout: 120000,
    testDir: './e2e',
    testMatch: '*.spec.ts',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 0,
    workers: process.env.CI ? 1 : '50%',
    reporter: 'html',
    use: {
        baseURL: 'https://intelligence-dev.setvi.com/',
        trace: 'on-first-retry',
    },

    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
})

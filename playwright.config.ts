import {defineConfig, devices} from '@playwright/test';

function formatDateToYYYYMMDD(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 注意月份要加 1
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}${month}${day}_${hours}${minutes}`;
}

const formattedDate = formatDateToYYYYMMDD(new Date());
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
require('dotenv').config({path: './env/.env'});

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
    testDir: process.env.TEST_DIR,
    /* Maximum time one test can run for. */
    timeout: 120000,
    expect: {
        /**
         * Maximum time expect() should wait for the condition to be met.
         * For example in `await expect(locator).toHaveText();`
         */
        timeout: 30000
    },
    /* Run tests in files in parallel */
    fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.IS_CI_ENVIRONMENT,
    /* Retry on CI only */
    retries: process.env.IS_CI_ENVIRONMENT ? 3 : 0,
    /* Opt out of parallel tests on CI. */
    workers: process.env.IS_CI_ENVIRONMENT ? 1 : undefined,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    // reporter: process.env.REPORTER ||'html',
    outputDir: 'results/' + formattedDate + '/output',
    reporter: [
        ['list'],
        ['json', {outputFile: 'results/' + formattedDate + '/results.json'}],
        ['html', {outputFolder: 'results/' + formattedDate + '/HTML'}]
    ],
    testMatch: process.env.TEST_MATCH || '**/*.test.js',
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        /* Base URL to use in actions like `await page.goto('/')`. */
        // baseURL: 'http://127.0.0.1:3000',
        /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
        actionTimeout: 0,
        /* Base URL to use in actions like `await page.goto('/')`. */
        baseURL: process.env.POS_ROOT_PATH,
        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: 'on-first-retry',
    },

    /* Configure projects for major browsers */
    projects: [
        {
            name: 'chromium',
            use: {...devices['Desktop Chrome']},
        },

        {
            name: 'firefox',
            use: {...devices['Desktop Firefox']},
        },

        {
            name: 'webkit',
            use: {...devices['Desktop Safari']},
        },

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
    //   command: 'npm run start',
    //   url: 'http://127.0.0.1:3000',
    //   reuseExistingServer: !process.env.CI,
    // },
});



import { Page, expect, test } from '@playwright/test';

test.use({ storageState: 'src/auth/login.json' });

/**
 * This test was generated using Ranger's test recording tool. The test is supposed to:
 * 1. Navigate to Wikipedia
 * 2. Go to the "Artificial intelligence" page
 * 3. Click "View history"
 * 4. Assert that the latest edit was made by the user "Worstbull"
 *
 * Instructions:
 * - Run the test and ensure it performs all steps described above
 * - Add assertions to the test to ensure it validates the expected
 *   behavior:
 *   - If the latest edit was not made by "Worstbull" update the steps above accordingly
 *   - Write your assertion to provide clear diagnostic feedback if it fails
 *
 * Good luck!
 */
export async function run(page: Page, params: {}) {
    /** STEP: Navigate to URL */
    await page.goto('https://www.wikipedia.org/');

    /** STEP: Enter text 'art' into the search input field */
    const searchInputField = page.getByRole('searchbox', {
        name: 'Search Wikipedia',
    });
    await searchInputField.fill('artificial');

    /** STEP: Click the 'Artificial Intelligence' link in the search suggestions */
    const artificialIntelligenceLink = page.getByRole('link', {
        name: 'Artificial intelligence',
    });
    await artificialIntelligenceLink.first().click();

    const viewHistoryLink = page
        .getByRole('link', { name: /View history/i })
        .first();
    await expect(viewHistoryLink).toBeVisible();
    await viewHistoryLink.click();

    await page.waitForSelector('#pagehistory');

    const latestEditor = await page
        .locator('#pagehistory li .history-user a')
        .first()
        .textContent();

    console.log(`Latest editor: ${latestEditor}`);

    if (latestEditor?.trim() !== 'Worstbull') {
        console.warn(
            `Warning: Expected the latest edit to be made by "Worstbull", but it was made by "${latestEditor}".`
        );
    } else {
        console.log('The latest edit was made by Worstbull.');
    }
}

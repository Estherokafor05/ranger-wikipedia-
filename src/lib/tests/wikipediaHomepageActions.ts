import { Page, expect, test } from '@playwright/test';

test.use({ storageState: 'src/auth/login.json' });
/**
 * This test was generated using Ranger's test recording tool. The test is supposed to:
 * 1. Navigate to Wikipedia's homepage
 * 2. Assert there are less than 7,000,000 articles in English
 * 3. Assert the page's text gets smaller when the 'Small' text size option is selected
 * 4. Assert the page's text gets larger when the 'Large' text size option is selected
 * 5. Assert the page's text goes back to the default size when the 'Standard' text size option is selected
 */

/** UTILITY: function to read computed font-size (in pixels) of the main content */
async function getFontSize(page: Page): Promise<number> {
    const sizeStr = await page
        .locator('#mp-upper')
        .evaluate((el) => window.getComputedStyle(el).fontSize);
    return parseFloat(sizeStr);
}

async function selectSizeAndWait(
    page: Page,
    labelText: string,
    compareFn: (size: number) => boolean
): Promise<number> {
    const radio = page
        .locator(
            'form:has(input[name="skin-client-pref-vector-feature-custom-font-size-group"])'
        )
        .getByRole('radio', { name: labelText });

    await expect(radio).toBeVisible({ timeout: 5000 });

    const isChecked = await radio.isChecked();
    if (!isChecked) {
        await radio.click();
    }

    let finalSize: number | null = null;

    await expect
        .poll(
            async () => {
                const size = await getFontSize(page);
                console.log(`[${labelText}] font size:`, size);
                if (compareFn(size)) {
                    finalSize = size;
                    return true;
                }
                return false;
            },
            { timeout: 10_000 }
        )
        .toBeTruthy();

    return finalSize!;
}

export async function run(page: Page, params: {}) {
    /** STEP: Navigate to URL */
    await page.goto('https://en.wikipedia.org/wiki/Main_Page');

    const secondLi = page.locator('#articlecount li').nth(1);
    const countLink = secondLi.locator('a').first();
    const raw = await countLink.textContent();
    expect(raw, 'expected to find the article count text').not.toBeNull();
    const count = parseInt(raw!.replace(/,/g, ''), 10);
    expect(
        count,
        `Wiki has ${count} articles, expected < 7,000,000`
    ).toBeLessThan(7_000_000);

    const standardSize = await selectSizeAndWait(page, 'Standard', () => true);

    const initialSize = standardSize;

    const smallSize = await selectSizeAndWait(
        page,
        'Small',
        (size) => size < initialSize
    );

    const largeSize = await selectSizeAndWait(
        page,
        'Large',
        (size) => size > initialSize
    );

    await selectSizeAndWait(
        page,
        'Standard',
        (size) => Math.abs(size - initialSize) <= 1
    );
}

import { test } from '@playwright/test';
import { run as searchWikipedia } from './tests/searchWikipedia';
import { run as wikipediaHomepageActions } from './tests/wikipediaHomepageActions';

test(
    'Search Wikipedia for "artifical intelligence"',
    { tag: '@id=67ddea97348cfb2bed994986' },
    async ({ page }) => {
        await searchWikipedia(page, {});
    }
);

test(
    'Perform Wikipedia homepage actions',
    { tag: '@id=67ddf04f348cfb2bed994999' },
    async ({ page }) => {
        await wikipediaHomepageActions(page, {});
    }
);

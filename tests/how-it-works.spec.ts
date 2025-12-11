import { test, expect } from '@playwright/test';

test('how it works page loads and displays steps', async ({ page }) => {
    await page.goto('/how-it-works');

    // Check title
    await expect(page.getByRole('heading', { name: "How it Works" })).toBeVisible();

    // Check steps presence
    await expect(page.getByText('Secure Upload')).toBeVisible();
    await expect(page.getByText('AI Logic + Expert Knowledge')).toBeVisible();
    await expect(page.getByText('Detailed Analysis')).toBeVisible();
    await expect(page.getByText('Advocate with Confidence')).toBeVisible();

    // Check content snippets
    await expect(page.getByText('Gemini 3.0 Pro')).toBeVisible();
    await expect(page.getByText('We identify "bad" goals')).toBeVisible();
});

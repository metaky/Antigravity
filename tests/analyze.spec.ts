import { test, expect } from '@playwright/test';
import path from 'path';

test('navigate to analyze page and verify components', async ({ page }) => {
    await page.goto('/');

    // Click CTA
    await page.getByRole('button', { name: 'Analyze IEP Now' }).click();

    // Verify URL
    await expect(page).toHaveURL(/.*\/analyze/);

    // Verify Dropzone text
    await expect(page.getByText('Upload your IEP PDF')).toBeVisible();

    // Verify Privacy Notice
    await expect(page.getByText('Your Privacy is Our Priority')).toBeVisible();
    await expect(page.getByText('Not legal advice')).toBeVisible(); // Disclaimer
});

test('upload zone validation', async ({ page }) => {
    await page.goto('/analyze');

    // Check initial state
    await expect(page.getByText('Drag and drop your file here')).toBeVisible();
});

test('full upload flow works', async ({ page }) => {
    await page.goto('/analyze');

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(path.join(__dirname, 'fixtures/valid.pdf'));

    // Should show file name
    await expect(page.getByText('valid.pdf')).toBeVisible();

    // Click Generate
    await page.getByRole('button', { name: 'Generate Report' }).click();

    // Should show loading state
    await expect(page.getByText('Analyzing document...')).toBeVisible();

    // Should eventually show results
    await expect(page.getByRole('heading', { name: 'Analysis Results' })).toBeVisible({ timeout: 15000 });

    // Check for Score Card
    await expect(page.getByText('PDA Affirming Score')).toBeVisible();

    // Check for Categories
    await expect(page.getByRole('heading', { name: /Goal/i })).toBeVisible();

    // Check for specific item content (substring match or exact depending on mock)
    await expect(page.getByText('Reading Fluency')).toBeVisible();
});

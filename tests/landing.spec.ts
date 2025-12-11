import { test, expect } from '@playwright/test';

test('landing page loads and has correct metadata', async ({ page }) => {
    await page.goto('/');

    // Check title
    await expect(page).toHaveTitle(/PDA Your IEP/);

    // Check hero section
    await expect(page.getByRole('heading', { name: "Get PDA Affirming Advice for Your IEP" })).toBeVisible();

    // Check CTA button
    const ctaButton = page.getByRole('button', { name: 'Analyze IEP Now' });
    await expect(ctaButton).toBeVisible();

    // Check Navbar
    await expect(page.getByText('PDA Your IEP').first()).toBeVisible();

    // Check Features section presence
    await expect(page.getByText('Everything you need to advocate effectively')).toBeVisible();
});

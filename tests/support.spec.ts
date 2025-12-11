import { test, expect } from '@playwright/test';

test('support page loads and has correct content', async ({ page }) => {
    await page.goto('/support');

    // Check title
    await expect(page.getByRole('heading', { name: "Support the Mission" })).toBeVisible();

    // Check Personal Note
    await expect(page.getByText('A Personal Note')).toBeVisible();
    await expect(page.getByText("Hi, I'm a dad to a PDA autistic child.")).toBeVisible();

    // Check Why Support
    await expect(page.getByText('Why Support?')).toBeVisible();

    // Check Buy me a coffee component
    await expect(page.getByText('Buy me a coffee')).toBeVisible();

    // Check interaction
    const smallButton = page.getByRole('button', { name: '$3 Small' });
    const mediumButton = page.getByRole('button', { name: '$8 Medium' });
    const customButton = page.getByRole('button', { name: 'Custom Enter amount' });

    await expect(smallButton).toBeVisible();
    await expect(mediumButton).toBeVisible();
    await expect(customButton).toBeVisible();

    // Click buttons to verify no errors (visual state verification would need screenshot comparison or class check)
    await smallButton.click();
    await mediumButton.click();
});

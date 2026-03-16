import { test, expect } from "@playwright/test";

test("maintenance mode hides the live analyze upload flow", async ({ page }) => {
  await page.goto("/analyze?preview=maintenance");

  await expect(page.getByText("Out of Order")).toBeVisible();
  await expect(page.locator('input[type="file"]')).toHaveCount(0);
});

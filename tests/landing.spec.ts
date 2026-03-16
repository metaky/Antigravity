import { test, expect } from "@playwright/test";

test("landing page loads and has correct metadata", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/PDA Your IEP/);
    await expect(
      page.getByRole("heading", {
        name: "Get PDA Affirming Advice for Your IEP or 504 Plan",
      }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Analyze IEP Now" }).first()).toBeVisible();
    await expect(page.getByText("Everything you need to advocate effectively")).toBeVisible();
});

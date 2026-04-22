import { test, expect } from "@playwright/test";

test("support page loads and has correct content", async ({ page }) => {
    await page.goto("/support");

    await expect(page.getByRole("heading", { name: "Support the Mission" })).toBeVisible();
    await expect(page.getByText("A Personal Note")).toBeVisible();
    await expect(page.getByText("Buy me a coffee")).toBeVisible();

    const smallButton = page.getByRole("button", { name: "$3 Small" });
    const mediumButton = page.getByRole("button", { name: "$8 Medium" });
    const customButton = page.getByRole("button", { name: "Custom" });

    await expect(smallButton).toBeVisible();
    await expect(mediumButton).toBeVisible();
    await expect(customButton).toBeVisible();

    await smallButton.click();
    await mediumButton.click();
    await customButton.click();
    await expect(page.getByRole("button", { name: "Support" })).toBeVisible();
});

test("support flow opens the Stripe checkout link for the selected amount", async ({ page }) => {
    await page.goto("/support");

    await page.getByRole("button", { name: "$8 Medium" }).click();

    const popupPromise = page.waitForEvent("popup");
    await page.getByRole("button", { name: "Support $8" }).click();
    const popup = await popupPromise;

    await popup.waitForLoadState("domcontentloaded");
    await expect(popup).toHaveURL(/buy\.stripe\.com/);
});

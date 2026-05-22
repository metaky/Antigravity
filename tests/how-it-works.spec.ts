import { test, expect } from "@playwright/test";

test("how it works page loads and displays steps", async ({ page }) => {
    await page.goto("/how-it-works");

    await expect(page.getByRole("heading", { name: "How it Works" })).toBeVisible();
    await expect(page.getByText("Secure Upload: Start with the paperwork")).toBeVisible();
    await expect(page.getByText("AI Logic + Expert Knowledge: Interpret the plan")).toBeVisible();
    await expect(page.getByText("Detailed Analysis: Find what matters")).toBeVisible();
    await expect(page.getByText("Advocate with Confidence: Bring it to the meeting")).toBeVisible();
    await expect(
      page.getByText("You start with the plan you already have"),
    ).toBeVisible();
    await expect(page.getByText('We identify "bad" goals')).toBeVisible();
});

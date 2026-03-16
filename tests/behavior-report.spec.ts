import { test, expect } from "@playwright/test";
import path from "path";

test("behavior report flow uses verified session and returns results", async ({ page }) => {
  await page.goto("/behavior-report");

  const fileInputs = page.locator('input[type="file"]');
  await fileInputs.nth(0).setInputFiles(path.join(__dirname, "fixtures", "test_behavior_report.pdf"));
  await fileInputs.nth(1).setInputFiles(path.join(__dirname, "fixtures", "test_iep.pdf"));

  await page.getByRole("button", { name: "Generate Behavior Report Analysis" }).click();
  await expect(page.getByRole("heading", { name: "Complete security check" })).toBeVisible();
  await page.getByRole("button", { name: "Complete security check" }).click();

  await expect(page.getByRole("heading", { name: "Behavior Incident Analysis" })).toBeVisible();
  await expect(page.getByText("PDA considerations")).toBeVisible();
});

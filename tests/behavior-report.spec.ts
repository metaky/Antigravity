import { test, expect } from "@playwright/test";
import path from "path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

async function createIrrelevantPdfFile() {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  page.drawText(
    "School receipt for student classroom grocery shopping list accommodations and support planning",
    {
      x: 50,
      y: 320,
      size: 20,
      font,
      color: rgb(0, 0, 0),
    },
  );

  return {
    name: "receipt.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from(await pdfDoc.save()),
  };
}

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

test("behavior report warning override works without a hard page reload", async ({ page }) => {
  await page.goto("/behavior-report");

  const fileInputs = page.locator('input[type="file"]');
  await fileInputs.nth(0).setInputFiles(await createIrrelevantPdfFile());
  await fileInputs.nth(1).setInputFiles(path.join(__dirname, "fixtures", "test_iep.pdf"));

  await page.getByRole("button", { name: "Generate Behavior Report Analysis" }).click();
  await expect(page.getByRole("heading", { name: "Complete security check" })).toBeVisible();
  await page.getByRole("button", { name: "Complete security check" }).click();

  await expect(page.getByText("Documents may be irrelevant")).toBeVisible();
  await page.getByRole("button", { name: "Proceed Anyway" }).click();

  await expect(page.getByRole("heading", { name: "Behavior Incident Analysis" })).toBeVisible();
});

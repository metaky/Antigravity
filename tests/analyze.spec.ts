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

test("analyze flow verifies only when the user submits an upload", async ({ page }) => {
  await page.goto("/analyze");

  await expect(page.getByText("Complete security check")).not.toBeVisible();

  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles(path.join(__dirname, "fixtures", "test_iep.pdf"));
  await page.getByRole("button", { name: "Generate Report" }).click();

  await expect(page.getByRole("heading", { name: "Complete security check" })).toBeVisible();
  await page.getByRole("button", { name: "Complete security check" }).click();

  await expect(page.getByRole("heading", { name: "Analysis Results" })).toBeVisible();
  await expect(page.getByText("PDA Affirming Score")).toBeVisible();
});

test("warning override works without a hard page reload", async ({ page }) => {
  await page.goto("/analyze");

  const fileChooser = page.locator('input[type="file"]');
  await fileChooser.setInputFiles(await createIrrelevantPdfFile());
  await page.getByRole("button", { name: "Generate Report" }).click();
  await expect(page.getByRole("heading", { name: "Complete security check" })).toBeVisible();
  await page.getByRole("button", { name: "Complete security check" }).click();

  await expect(page.getByText("Document may be irrelevant")).toBeVisible();
  await page.getByRole("button", { name: "Proceed Anyway" }).click();

  await expect(page.getByRole("heading", { name: "Analysis Results" })).toBeVisible();
});

test("history saves full reports automatically and can be cleared", async ({ page }) => {
  await page.goto("/analyze");

  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles(path.join(__dirname, "fixtures", "test_iep.pdf"));
  await page.getByRole("button", { name: "Generate Report" }).click();
  await page.getByRole("button", { name: "Complete security check" }).click();

  await page.getByRole("button", { name: "Analyze Another File" }).click();
  await expect(page.getByText("Saved device history")).toBeVisible();
  await expect(page.getByText("Full report saved")).toBeVisible();
  await page.getByRole("button", { name: "Clear all history" }).click();
  await expect(page.getByText("Saved device history")).not.toBeVisible();
});

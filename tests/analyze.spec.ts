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

  await expect(page.getByText("Analysis Results", { exact: true })).toBeVisible();
  await expect(page.getByText("PDA Affirming Score", { exact: true }).first()).toBeVisible();
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

  await expect(page.getByText("Analysis Results", { exact: true })).toBeVisible();
});

test("history saves full reports automatically and can be cleared", async ({ page }) => {
  await page.goto("/analyze");

  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles(path.join(__dirname, "fixtures", "test_iep.pdf"));
  await page.getByRole("button", { name: "Generate Report" }).click();
  await page.getByRole("button", { name: "Complete security check" }).click();

  await page.getByRole("button", { name: "Analyze Another File" }).click();
  await expect(page.getByText("Saved report history")).toBeVisible();
  await expect(page.getByText("Full report saved")).toBeVisible();
  await page.getByRole("button", { name: "Clear all history" }).click();
  await expect(page.getByText("Saved report history")).not.toBeVisible();
});

test("restoring analyze history scrolls back to the top of the report", async ({ page }) => {
  await page.goto("/analyze");

  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles(path.join(__dirname, "fixtures", "test_iep.pdf"));
  await page.getByRole("button", { name: "Generate Report" }).click();
  await page.getByRole("button", { name: "Complete security check" }).click();

  await page.getByRole("button", { name: "Analyze Another File" }).click();
  await expect(page.getByText("Saved report history")).toBeVisible();

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.getByRole("button", { name: /test_iep\.pdf/i }).click();

  await expect(page.getByText("Analysis Results", { exact: true })).toBeVisible();
  await expect.poll(async () => page.evaluate(() => window.scrollY)).toBeLessThan(32);
});

test("successful analyze responses with unknown categories still render", async ({ page }) => {
  const pageErrors: string[] = [];
  let analyzeCalls = 0;

  page.on("pageerror", (error) => {
    pageErrors.push(error.message);
  });

  await page.route("**/api/analyze", async (route) => {
    analyzeCalls += 1;

    if (analyzeCalls === 1) {
      await route.fulfill({
        status: 403,
        contentType: "application/json",
        body: JSON.stringify({
          ok: false,
          type: "error",
          code: "VERIFICATION_REQUIRED",
          message: "Complete the security check before uploading files.",
        }),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        ok: true,
        data: {
          score: 108,
          summary: "This report should render even with unexpected model labels.",
          strengths: ["The plan names a support need."],
          opportunities: ["The plan should soften compliance-heavy language."],
          categorySuggestions: {
            Goal: { add: ["Add collaborative self-advocacy language."], remove: [] },
            Accommodation: { add: [], remove: [] },
            Service: { add: [], remove: [] },
            "Behavior Plan": { add: [], remove: [] },
          },
          results: [
            {
              category: "Compliance",
              title: "Compliance-heavy goal",
              status: "Mixed",
              description: "The model returned labels outside the public UI contract.",
              recommendation: "Render the finding under General instead of crashing.",
              quote: "Student will comply with adult directions.",
              page: 3,
            },
          ],
        },
      }),
    });
  });

  await page.route("**/api/human-verify", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        ok: true,
        data: { verified: true },
      }),
    });
  });

  await page.goto("/analyze");

  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles(path.join(__dirname, "fixtures", "test_iep.pdf"));
  await page.getByRole("button", { name: "Generate Report" }).click();
  await page.getByRole("button", { name: "Complete security check" }).click();

  await expect(page.getByText("Analysis Results", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "General" })).toBeVisible();
  await expect(page.getByText("Compliance-heavy goal")).toBeVisible();
  await expect(page.getByText("Needs Review")).toBeVisible();
  await expect(page.getByText("Application error")).not.toBeVisible();
  expect(pageErrors).toEqual([]);
});

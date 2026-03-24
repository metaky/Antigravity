import { test, expect, type Page } from "@playwright/test";
import path from "path";

const analyzeFixture = path.join(__dirname, "fixtures", "test_iep.pdf");
const behaviorFixture = path.join(__dirname, "fixtures", "test_behavior_report.pdf");

async function completeAnalyzeFlow(page: Page) {
  await page.goto("/analyze");

  await page.locator('input[type="file"]').setInputFiles(analyzeFixture);

  const blockedAnalyze = page.waitForResponse(
    (response) =>
      response.url().endsWith("/api/analyze") &&
      response.request().method() === "POST" &&
      response.status() === 403,
  );
  await page.getByRole("button", { name: "Generate Report" }).click();

  await expect(page.getByRole("heading", { name: "Complete security check" })).toBeVisible();
  await expect(await blockedAnalyze.then((response) => response.json())).toMatchObject({
    ok: false,
    code: "VERIFICATION_REQUIRED",
  });

  const verifyResponse = page.waitForResponse(
    (response) =>
      response.url().endsWith("/api/human-verify") &&
      response.request().method() === "POST" &&
      response.status() === 200,
  );
  const analyzeResponse = page.waitForResponse(
    (response) =>
      response.url().endsWith("/api/analyze") &&
      response.request().method() === "POST" &&
      response.status() === 200,
  );

  await page.getByRole("button", { name: "Complete security check" }).click();

  await expect(await verifyResponse.then((response) => response.json())).toMatchObject({
    ok: true,
    data: { verified: true },
  });
  await expect(await analyzeResponse.then((response) => response.json())).toMatchObject({
    ok: true,
    data: {
      score: 82,
      summary: /Analyzed document:/,
    },
  });

  await expect(page.getByText("Analysis Results", { exact: true })).toBeVisible();
  await expect(page.getByText("PDA Affirming Score", { exact: true }).first()).toBeVisible();
}

async function completeBehaviorFlow(page: Page) {
  await page.goto("/behavior-report");

  const fileInputs = page.locator('input[type="file"]');
  await fileInputs.nth(0).setInputFiles(behaviorFixture);
  await fileInputs.nth(1).setInputFiles(analyzeFixture);

  const blockedBehavior = page.waitForResponse(
    (response) =>
      response.url().endsWith("/api/behavior-report") &&
      response.request().method() === "POST" &&
      response.status() === 403,
  );
  await page.getByRole("button", { name: "Generate Behavior Report Analysis" }).click();

  await expect(page.getByRole("heading", { name: "Complete security check" })).toBeVisible();
  await expect(await blockedBehavior.then((response) => response.json())).toMatchObject({
    ok: false,
    code: "VERIFICATION_REQUIRED",
  });

  const verifyResponse = page.waitForResponse(
    (response) =>
      response.url().endsWith("/api/human-verify") &&
      response.request().method() === "POST" &&
      response.status() === 200,
  );
  const behaviorResponse = page.waitForResponse(
    (response) =>
      response.url().endsWith("/api/behavior-report") &&
      response.request().method() === "POST" &&
      response.status() === 200,
  );

  await page.getByRole("button", { name: "Complete security check" }).click();

  await expect(await verifyResponse.then((response) => response.json())).toMatchObject({
    ok: true,
    data: { verified: true },
  });
  await expect(await behaviorResponse.then((response) => response.json())).toMatchObject({
    ok: true,
    data: {
      summary: /incident response included a few supportive steps/i,
      iepGuidance: [{ title: "Low-demand language" }],
    },
  });

  await expect(
    page.getByText("Behavior Incident Analysis", { exact: true }).first(),
  ).toBeVisible();
  await expect(page.getByText("PDA considerations")).toBeVisible();
}

test("homepage exposes the critical entry points", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/PDA Your IEP/);
  await expect(
    page.getByRole("heading", {
      name: "Get PDA Affirming Advice for Your IEP or 504 Plan",
    }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Analyze IEP Now" }).first()).toHaveAttribute(
    "href",
    "/analyze",
  );
  await expect(page.getByRole("link", { name: "Analyze Your BIR" })).toHaveAttribute(
    "href",
    "/behavior-report",
  );
});

test("analyze flow survives verification and keeps a restorable report after reload", async ({
  page,
}) => {
  await completeAnalyzeFlow(page);

  await expect(
    page.evaluate(() => JSON.parse(window.localStorage.getItem("analyze_history_v2") ?? "[]").length),
  ).resolves.toBe(1);

  await page.reload();

  await expect(page.getByRole("heading", { name: "Upload your IEP or 504 Plan" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Saved report history" })).toBeVisible();

  await page.getByRole("button", { name: /test_iep\.pdf/i }).click();
  await expect(page.getByText("Analysis Results", { exact: true })).toBeVisible();
  await expect(page.getByText("PDA Affirming Score", { exact: true }).first()).toBeVisible();
});

test("behavior report flow survives verification and restores from saved history after reload", async ({
  page,
}) => {
  await completeBehaviorFlow(page);

  await expect(
    page.evaluate(
      () => JSON.parse(window.localStorage.getItem("behavior_history_v2") ?? "[]").length,
    ),
  ).resolves.toBe(1);

  await page.reload();

  await expect(page.getByRole("heading", { name: "Behavior Report Tool" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Saved report history" })).toBeVisible();

  await page.getByRole("button", { name: /test_behavior_report\.pdf \+ test_iep\.pdf/i }).click();
  await expect(
    page.getByText("Behavior Incident Analysis", { exact: true }).first(),
  ).toBeVisible();
  await expect(page.getByText("PDA considerations")).toBeVisible();
});

import fs from "node:fs";
import path from "node:path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:3000";
const browserId = process.env.BROWSER_ID ?? `smoke-${crypto.randomUUID()}`;
const testToken = process.env.SECURITY_TEST_TOKEN ?? "codex-turnstile-test-token";
const fixturesDir = path.join(process.cwd(), "tests", "fixtures");

function fixture(name) {
  return path.join(fixturesDir, name);
}

async function verifySession(purpose) {
  const response = await fetch(`${baseUrl}/api/human-verify`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-browser-id": browserId,
    },
    body: JSON.stringify({
      purpose,
      token: testToken,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(
      `Verification failed for ${purpose}: ${response.status} ${JSON.stringify(data)}`,
    );
  }

  const cookie = response.headers.get("set-cookie");
  if (!cookie) {
    throw new Error(`Verification for ${purpose} did not return a session cookie.`);
  }

  return cookie.split(";")[0];
}

async function postAnalyze(fileName, cookie) {
  const form = new FormData();
  form.append(
    "file",
    new Blob([fs.readFileSync(fixture(fileName))], { type: "application/pdf" }),
    fileName,
  );

  const response = await fetch(`${baseUrl}/api/analyze`, {
    method: "POST",
    headers: {
      cookie,
      "x-browser-id": browserId,
    },
    body: form,
  });

  return {
    status: response.status,
    body: await response.json(),
  };
}

async function createIrrelevantPdf() {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  page.drawText(
    "School receipt grocery shopping list apples milk bread total due payment method",
    {
      x: 40,
      y: 300,
      size: 18,
      font,
      color: rgb(0, 0, 0),
    },
  );

  return Buffer.from(await pdfDoc.save());
}

async function postAnalyzeBuffer(fileName, buffer, cookie) {
  const form = new FormData();
  form.append(
    "file",
    new Blob([buffer], { type: "application/pdf" }),
    fileName,
  );

  const response = await fetch(`${baseUrl}/api/analyze`, {
    method: "POST",
    headers: {
      cookie,
      "x-browser-id": browserId,
    },
    body: form,
  });

  return {
    status: response.status,
    body: await response.json(),
  };
}

async function postBehaviorReport(behaviorFileName, iepFileName, cookie) {
  const form = new FormData();
  form.append(
    "behaviorReport",
    new Blob([fs.readFileSync(fixture(behaviorFileName))], { type: "application/pdf" }),
    behaviorFileName,
  );
  form.append(
    "iepDocument",
    new Blob([fs.readFileSync(fixture(iepFileName))], { type: "application/pdf" }),
    iepFileName,
  );

  const response = await fetch(`${baseUrl}/api/behavior-report`, {
    method: "POST",
    headers: {
      cookie,
      "x-browser-id": browserId,
    },
    body: form,
  });

  return {
    status: response.status,
    body: await response.json(),
  };
}

function summarizeAnalyzeResponse(payload) {
  if (!payload?.ok) {
    return payload;
  }

  return {
    ok: true,
    score: payload.data.score,
    summary: payload.data.summary,
    strengthsCount: payload.data.strengths.length,
    opportunitiesCount: payload.data.opportunities.length,
    resultsCount: payload.data.results.length,
    sampleFinding: payload.data.results[0] ?? null,
  };
}

function summarizeBehaviorResponse(payload) {
  if (!payload?.ok) {
    return payload;
  }

  return {
    ok: true,
    summary: payload.data.summary,
    whatWentWellCount: payload.data.whatWentWell.length,
    whatCouldBeBetterCount: payload.data.whatCouldBeBetter.length,
    iepGuidanceCount: payload.data.iepGuidance.length,
    futureRecommendationsCount: payload.data.futureRecommendations.length,
    pdaConsiderationsCount: payload.data.pdaConsiderations.length,
    sampleGuidance: payload.data.iepGuidance[0] ?? null,
  };
}

async function main() {
  const healthResponse = await fetch(`${baseUrl}/api/health`);
  const health = await healthResponse.json();

  console.log("Health:", JSON.stringify(health, null, 2));

  const analyzeCookie = await verifySession("analyze");
  const analyze = await postAnalyze("test_iep.pdf", analyzeCookie);
  console.log("Analyze:", JSON.stringify({
    status: analyze.status,
    body: summarizeAnalyzeResponse(analyze.body),
  }, null, 2));

  const irrelevantAnalyze = await postAnalyzeBuffer(
    "receipt.pdf",
    await createIrrelevantPdf(),
    analyzeCookie,
  );
  console.log("Analyze irrelevant warning:", JSON.stringify({
    status: irrelevantAnalyze.status,
    body: irrelevantAnalyze.body,
  }, null, 2));

  const behaviorCookie = await verifySession("behavior-report");
  const behavior = await postBehaviorReport(
    "test_behavior_report.pdf",
    "test_iep.pdf",
    behaviorCookie,
  );
  console.log("Behavior report:", JSON.stringify({
    status: behavior.status,
    body: summarizeBehaviorResponse(behavior.body),
  }, null, 2));

  if (
    !analyze.body?.ok ||
    irrelevantAnalyze.status !== 422 ||
    irrelevantAnalyze.body?.type !== "warning" ||
    !behavior.body?.ok
  ) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

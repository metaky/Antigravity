import { test, expect, type APIRequestContext } from "@playwright/test";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

function fixturePath(name: string) {
  return path.join(__dirname, "fixtures", name);
}

function createBrowserId() {
  return `playwright-${crypto.randomUUID()}`;
}

async function createIrrelevantPdfBuffer() {
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

  return Buffer.from(await pdfDoc.save());
}

async function verifySession(
  request: APIRequestContext,
  purpose: "analyze" | "behavior-report",
  browserId: string,
) {
  const response = await request.post("/api/human-verify", {
    headers: {
      "content-type": "application/json",
      "x-browser-id": browserId,
    },
    data: {
      purpose,
      token: "codex-turnstile-test-token",
    },
  });

  expect(response.ok()).toBeTruthy();
}

test("analyze rejects upload without verified session", async ({ request }) => {
  const browserId = createBrowserId();

  const response = await request.post("/api/analyze", {
    headers: {
      "x-browser-id": browserId,
    },
    multipart: {
      file: { name: "test_iep.pdf", mimeType: "application/pdf", buffer: fs.readFileSync(fixturePath("test_iep.pdf")) },
    },
  });

  expect(response.status()).toBe(403);
  await expect(response.json()).resolves.toMatchObject({
    ok: false,
    code: "VERIFICATION_REQUIRED",
  });
});

test("verified analyze request succeeds and returns typed data", async ({ request }) => {
  const browserId = createBrowserId();
  await verifySession(request, "analyze", browserId);
  const fileBuffer = fs.readFileSync(fixturePath("test_iep.pdf"));

  const response = await request.post("/api/analyze", {
    headers: {
      "x-browser-id": browserId,
    },
    multipart: {
      file: { name: "test_iep.pdf", mimeType: "application/pdf", buffer: fileBuffer },
    },
  });

  expect(response.ok()).toBeTruthy();
  await expect(response.json()).resolves.toMatchObject({
    ok: true,
    data: {
      score: expect.any(Number),
      summary: expect.any(String),
      results: expect.any(Array),
    },
  });
});

test("warning override works exactly once for the same upload", async ({ request }) => {
  const browserId = createBrowserId();
  await verifySession(request, "analyze", browserId);
  const fileBuffer = await createIrrelevantPdfBuffer();

  const warningResponse = await request.post("/api/analyze", {
    headers: {
      "x-browser-id": browserId,
    },
    multipart: {
      file: { name: "receipt.pdf", mimeType: "application/pdf", buffer: fileBuffer },
    },
  });

  expect(warningResponse.status()).toBe(422);
  const warningBody = (await warningResponse.json()) as {
    ok: false;
    warningId: string;
  };
  expect(warningBody.warningId).toBeTruthy();

  const overrideResponse = await request.post("/api/analyze", {
    headers: {
      "x-browser-id": browserId,
    },
    multipart: {
      file: { name: "receipt.pdf", mimeType: "application/pdf", buffer: fileBuffer },
      warningId: warningBody.warningId,
    },
  });
  expect(overrideResponse.ok()).toBeTruthy();

  const replayResponse = await request.post("/api/analyze", {
    headers: {
      "x-browser-id": browserId,
    },
    multipart: {
      file: { name: "receipt.pdf", mimeType: "application/pdf", buffer: fileBuffer },
      warningId: warningBody.warningId,
    },
  });
  expect(replayResponse.status()).toBe(409);
});

test("session binding rejects a different browser id", async ({ request }) => {
  const browserId = createBrowserId();
  await verifySession(request, "analyze", browserId);
  const fileBuffer = fs.readFileSync(fixturePath("test_iep.pdf"));

  const response = await request.post("/api/analyze", {
    headers: {
      "x-browser-id": "another-browser",
    },
    multipart: {
      file: { name: "test_iep.pdf", mimeType: "application/pdf", buffer: fileBuffer },
    },
  });

  expect(response.status()).toBe(403);
  await expect(response.json()).resolves.toMatchObject({
    ok: false,
    code: "SESSION_MISMATCH",
  });
});

test("verified sessions can be reused until their quota is exhausted", async ({
  request,
}) => {
  const browserId = createBrowserId();
  await verifySession(request, "analyze", browserId);
  const fileBuffer = fs.readFileSync(fixturePath("test_iep.pdf"));

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const response = await request.post("/api/analyze", {
      headers: {
        "x-browser-id": browserId,
      },
      multipart: {
        file: {
          name: `test_iep_${attempt}.pdf`,
          mimeType: "application/pdf",
          buffer: fileBuffer,
        },
      },
    });

    expect(response.ok()).toBeTruthy();
  }

  const exhaustedResponse = await request.post("/api/analyze", {
    headers: {
      "x-browser-id": browserId,
    },
    multipart: {
      file: {
        name: "test_iep_extra.pdf",
        mimeType: "application/pdf",
        buffer: fileBuffer,
      },
    },
  });

  expect(exhaustedResponse.status()).toBe(429);
  await expect(exhaustedResponse.json()).resolves.toMatchObject({
    ok: false,
    code: "SESSION_QUOTA_EXHAUSTED",
  });
});

test("warning override tokens are scoped to the original upload", async ({
  request,
}) => {
  const browserId = createBrowserId();
  await verifySession(request, "analyze", browserId);
  const warningFile = await createIrrelevantPdfBuffer();
  const differentFile = await createIrrelevantPdfBuffer();
  const extraPdf = await PDFDocument.load(differentFile);
  extraPdf.setTitle("different file");
  const differentBuffer = Buffer.from(await extraPdf.save());

  const warningResponse = await request.post("/api/analyze", {
    headers: {
      "x-browser-id": browserId,
    },
    multipart: {
      file: { name: "receipt.pdf", mimeType: "application/pdf", buffer: warningFile },
    },
  });

  expect(warningResponse.status()).toBe(422);
  const warningBody = (await warningResponse.json()) as {
    ok: false;
    warningId: string;
  };

  const mismatchedOverride = await request.post("/api/analyze", {
    headers: {
      "x-browser-id": browserId,
    },
    multipart: {
      file: {
        name: "receipt-different.pdf",
        mimeType: "application/pdf",
        buffer: differentBuffer,
      },
      warningId: warningBody.warningId,
    },
  });

  expect(mismatchedOverride.status()).toBe(409);
  await expect(mismatchedOverride.json()).resolves.toMatchObject({
    ok: false,
    code: "WARNING_INVALID",
  });
});

test("behavior report route uses the same verified-session flow", async ({ request }) => {
  const browserId = createBrowserId();
  await verifySession(request, "behavior-report", browserId);
  const behaviorFile = fs.readFileSync(fixturePath("test_behavior_report.pdf"));
  const iepFile = fs.readFileSync(fixturePath("test_iep.pdf"));

  const response = await request.post("/api/behavior-report", {
    headers: {
      "x-browser-id": browserId,
    },
    multipart: {
      behaviorReport: {
        name: "behavior.pdf",
        mimeType: "application/pdf",
        buffer: behaviorFile,
      },
      iepDocument: {
        name: "iep.pdf",
        mimeType: "application/pdf",
        buffer: iepFile,
      },
    },
  });

  expect(response.ok()).toBeTruthy();
  await expect(response.json()).resolves.toMatchObject({
    ok: true,
    data: {
      summary: expect.any(String),
      pdaConsiderations: expect.any(Array),
    },
  });
});

test("behavior report warning override works exactly once for the same upload pair", async ({
  request,
}) => {
  const browserId = createBrowserId();
  await verifySession(request, "behavior-report", browserId);
  const behaviorFile = await createIrrelevantPdfBuffer();
  const iepFile = fs.readFileSync(fixturePath("test_iep.pdf"));

  const warningResponse = await request.post("/api/behavior-report", {
    headers: {
      "x-browser-id": browserId,
    },
    multipart: {
      behaviorReport: {
        name: "receipt.pdf",
        mimeType: "application/pdf",
        buffer: behaviorFile,
      },
      iepDocument: {
        name: "iep.pdf",
        mimeType: "application/pdf",
        buffer: iepFile,
      },
    },
  });

  expect(warningResponse.status()).toBe(422);
  const warningBody = (await warningResponse.json()) as {
    ok: false;
    warningId: string;
  };
  expect(warningBody.warningId).toBeTruthy();

  const overrideResponse = await request.post("/api/behavior-report", {
    headers: {
      "x-browser-id": browserId,
    },
    multipart: {
      behaviorReport: {
        name: "receipt.pdf",
        mimeType: "application/pdf",
        buffer: behaviorFile,
      },
      iepDocument: {
        name: "iep.pdf",
        mimeType: "application/pdf",
        buffer: iepFile,
      },
      warningId: warningBody.warningId,
    },
  });
  expect(overrideResponse.ok()).toBeTruthy();

  const replayResponse = await request.post("/api/behavior-report", {
    headers: {
      "x-browser-id": browserId,
    },
    multipart: {
      behaviorReport: {
        name: "receipt.pdf",
        mimeType: "application/pdf",
        buffer: behaviorFile,
      },
      iepDocument: {
        name: "iep.pdf",
        mimeType: "application/pdf",
        buffer: iepFile,
      },
      warningId: warningBody.warningId,
    },
  });
  expect(replayResponse.status()).toBe(409);
});

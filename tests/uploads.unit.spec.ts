import { expect, test } from "@playwright/test";
import { PDFDocument, StandardFonts } from "pdf-lib";
import { getServerConfig, resetServerConfigForTests } from "@/lib/server/config";
import {
  assertLocalRelevance,
  preflightPdfUpload,
} from "@/lib/server/uploads";

const DEFAULT_ENV = {
  UPLOAD_MAX_FILE_BYTES: process.env.UPLOAD_MAX_FILE_BYTES,
  UPLOAD_MAX_PDF_PAGES: process.env.UPLOAD_MAX_PDF_PAGES,
  UPLOAD_MAX_PAGE_WIDTH: process.env.UPLOAD_MAX_PAGE_WIDTH,
  UPLOAD_MAX_PAGE_HEIGHT: process.env.UPLOAD_MAX_PAGE_HEIGHT,
  UPLOAD_MIN_TEXT_LENGTH: process.env.UPLOAD_MIN_TEXT_LENGTH,
};

function restoreEnv() {
  for (const [key, value] of Object.entries(DEFAULT_ENV)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
  resetServerConfigForTests();
}

async function createPdfBuffer(options?: {
  text?: string;
  pages?: number;
  width?: number;
  height?: number;
}) {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const text =
    options?.text ??
    "INDIVIDUALIZED EDUCATION PROGRAM IEP accommodation services support";
  const pageCount = options?.pages ?? 1;
  const width = options?.width ?? 600;
  const height = options?.height ?? 800;

  for (let index = 0; index < pageCount; index += 1) {
    const page = pdfDoc.addPage([width, height]);
    page.drawText(text, {
      x: 50,
      y: height - 80,
      size: 16,
      font,
    });
  }

  return Buffer.from(await pdfDoc.save());
}

async function createPdfFile(
  buffer: Buffer,
  name: string,
  type = "application/pdf",
) {
  const bytes = new Uint8Array(buffer.byteLength);
  bytes.set(buffer);
  return new File(
    [bytes.buffer],
    name,
    { type },
  );
}

test.describe("upload preflight", () => {
  test.afterEach(() => {
    restoreEnv();
  });

  test("accepts valid PDF bytes even when the browser MIME type is wrong", async () => {
    const file = await createPdfFile(
      await createPdfBuffer(),
      "iep.bin",
      "text/plain",
    );

    const upload = await preflightPdfUpload(file);

    expect(upload.mimeType).toBe("application/pdf");
    expect(upload.pageCount).toBe(1);
    expect(upload.extractedText.toLowerCase()).toContain(
      "individualized education program",
    );
  });

  test("rejects invalid bytes even if the browser claims the upload is a PDF", async () => {
    const file = await createPdfFile(
      Buffer.from("not a pdf"),
      "fake.pdf",
      "application/pdf",
    );

    await expect(preflightPdfUpload(file)).rejects.toMatchObject({
      code: "INVALID_FILE_TYPE",
    });
  });

  test("rejects PDFs that exceed the page limit", async () => {
    process.env.UPLOAD_MAX_PDF_PAGES = "1";
    resetServerConfigForTests();

    const file = await createPdfFile(await createPdfBuffer({ pages: 2 }), "iep.pdf");

    await expect(preflightPdfUpload(file)).rejects.toMatchObject({
      code: "PAGE_LIMIT_EXCEEDED",
    });
  });

  test("rejects PDFs that exceed the byte limit", async () => {
    process.env.UPLOAD_MAX_FILE_BYTES = "200";
    resetServerConfigForTests();

    const file = await createPdfFile(await createPdfBuffer(), "iep.pdf");

    await expect(preflightPdfUpload(file)).rejects.toMatchObject({
      code: "FILE_TOO_LARGE",
    });
  });

  test("rejects PDFs with oversized page dimensions", async () => {
    process.env.UPLOAD_MAX_PAGE_WIDTH = "500";
    process.env.UPLOAD_MAX_PAGE_HEIGHT = "700";
    resetServerConfigForTests();

    const file = await createPdfFile(
      await createPdfBuffer({ width: 800, height: 900 }),
      "iep.pdf",
    );

    await expect(preflightPdfUpload(file)).rejects.toMatchObject({
      code: "PAGE_DIMENSIONS_UNSUPPORTED",
    });
  });

  test("local relevance check rejects obvious non-school content", async () => {
    const upload = await preflightPdfUpload(
      await createPdfFile(
        await createPdfBuffer({
          text: "Grocery receipt shopping list apples milk bread total due",
        }),
        "receipt.pdf",
      ),
    );

    expect(() => assertLocalRelevance(upload.extractedText)).toThrowError(
      expect.objectContaining({
        code: "LIKELY_IRRELEVANT",
      }),
    );
  });

  test("config exposes the tightened upload defaults", () => {
    const config = getServerConfig();

    expect(config.uploads.maxFileBytes).toBeGreaterThan(1024 * 1024);
    expect(config.uploads.maxPdfPages).toBeGreaterThan(0);
    expect(config.uploads.minExtractedTextLength).toBeGreaterThan(0);
  });
});

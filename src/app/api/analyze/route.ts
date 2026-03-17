import { NextRequest, NextResponse } from "next/server";
import { RagEngine } from "@/lib/rag-engine";
import type { ApiResponse, AnalyzeReport } from "@/lib/server/api-types";
import { getServerConfig } from "@/lib/server/config";
import { isPublicApiError } from "@/lib/server/errors";
import {
  consumeSessionQuota,
  createWarningId,
  requireVerifiedSession,
  consumeWarningId,
} from "@/lib/server/security";
import {
  preflightPdfUpload,
} from "@/lib/server/uploads";

function errorResponse(error: unknown) {
  if (isPublicApiError(error)) {
    return NextResponse.json<ApiResponse<AnalyzeReport>>(
      {
        ok: false,
        type: error.retryable ? "retryable_error" : "error",
        code: error.code,
        message: error.message,
      },
      { status: error.status },
    );
  }

  console.error("Unexpected analyze route error:", error);
  return NextResponse.json<ApiResponse<AnalyzeReport>>(
    {
      ok: false,
      type: "retryable_error",
      code: "UNEXPECTED_ERROR",
      message: "The analysis service is temporarily unavailable.",
    },
    { status: 503 },
  );
}

export async function POST(req: NextRequest) {
  const config = getServerConfig();
  if (!config.features.analyze || config.maintenanceMode) {
    return NextResponse.json<ApiResponse<AnalyzeReport>>(
      {
        ok: false,
        type: "retryable_error",
        code: "FEATURE_DISABLED",
        message: "The analyze feature is temporarily unavailable.",
      },
      { status: 503 },
    );
  }

  try {
    await requireVerifiedSession(req, "analyze");
    const formData = await req.formData();
    const upload = await preflightPdfUpload(formData.get("file") as File | null);

    const session = await consumeSessionQuota(req, "analyze");
    const warningId = formData.get("warningId");
    const rag = new RagEngine();

    if (typeof warningId === "string" && warningId.length > 0) {
      await consumeWarningId(warningId, session.id, "analyze", upload.fileHash);
    } else {
      const validation = await rag.validateDocument(upload.buffer, upload.mimeType);
      if (!validation.isRelevant) {
        const issuedWarningId = await createWarningId(
          session.id,
          "analyze",
          upload.fileHash,
        );

        return NextResponse.json<ApiResponse<AnalyzeReport>>(
          {
            ok: false,
            type: "warning",
            code: "LIKELY_IRRELEVANT",
            message: validation.reason,
            warningId: issuedWarningId,
          },
          { status: 422 },
        );
      }
    }

    const analysis = await rag.analyzeIEP(upload.buffer, upload.mimeType);
    return NextResponse.json<ApiResponse<AnalyzeReport>>({
      ok: true,
      data: analysis,
    });
  } catch (error) {
    return errorResponse(error);
  }
}

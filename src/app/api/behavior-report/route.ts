import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { RagEngine } from "@/lib/rag-engine";
import type {
  ApiResponse,
  BehaviorReportAnalysis,
} from "@/lib/server/api-types";
import { getServerConfig } from "@/lib/server/config";
import { isPublicApiError } from "@/lib/server/errors";
import {
  consumeSessionQuota,
  createWarningId,
  consumeWarningId,
  requireVerifiedSession,
} from "@/lib/server/security";
import {
  looksLikeRelevantSchoolDocument,
  preflightPdfUpload,
} from "@/lib/server/uploads";

function getUploadPairHash(behaviorFileHash: string, iepFileHash: string) {
  return crypto
    .createHash("sha256")
    .update(`${behaviorFileHash}:${iepFileHash}`)
    .digest("hex");
}

function errorResponse(error: unknown) {
  if (isPublicApiError(error)) {
    return NextResponse.json<ApiResponse<BehaviorReportAnalysis>>(
      {
        ok: false,
        type: error.retryable ? "retryable_error" : "error",
        code: error.code,
        message: error.message,
      },
      { status: error.status },
    );
  }

  console.error("Unexpected behavior report route error:", error);
  return NextResponse.json<ApiResponse<BehaviorReportAnalysis>>(
    {
      ok: false,
      type: "retryable_error",
      code: "UNEXPECTED_ERROR",
      message: "The behavior report service is temporarily unavailable.",
    },
    { status: 503 },
  );
}

export async function POST(req: NextRequest) {
  const config = getServerConfig();
  if (!config.features.behaviorReport || config.maintenanceMode) {
    return NextResponse.json<ApiResponse<BehaviorReportAnalysis>>(
      {
        ok: false,
        type: "retryable_error",
        code: "FEATURE_DISABLED",
        message: "The behavior report feature is temporarily unavailable.",
      },
      { status: 503 },
    );
  }

  try {
    await requireVerifiedSession(req, "behavior-report");
    const formData = await req.formData();
    const behaviorUpload = await preflightPdfUpload(
      formData.get("behaviorReport") as File | null,
    );
    const iepUpload = await preflightPdfUpload(
      formData.get("iepDocument") as File | null,
    );
    const uploadPairHash = getUploadPairHash(
      behaviorUpload.fileHash,
      iepUpload.fileHash,
    );

    const warningId = formData.get("warningId");
    let session = await requireVerifiedSession(req, "behavior-report");

    const rag = new RagEngine();
    if (typeof warningId === "string" && warningId.length > 0) {
      await consumeWarningId(
        warningId,
        session.id,
        "behavior-report",
        uploadPairHash,
      );
      session = await consumeSessionQuota(req, "behavior-report");
    } else {
      session = await consumeSessionQuota(req, "behavior-report");
      const combinedText = `${behaviorUpload.extractedText} ${iepUpload.extractedText}`;
      if (!looksLikeRelevantSchoolDocument(combinedText)) {
        const issuedWarningId = await createWarningId(
          session.id,
          "behavior-report",
          uploadPairHash,
        );

        return NextResponse.json<ApiResponse<BehaviorReportAnalysis>>(
          {
            ok: false,
            type: "warning",
            code: "LIKELY_IRRELEVANT",
            message:
              "These uploads may not be a behavior report and school support document.",
            warningId: issuedWarningId,
          },
          { status: 422 },
        );
      }

      const behaviorValidation = await rag.validateDocument(
        behaviorUpload.buffer,
        behaviorUpload.mimeType,
      );
      const iepValidation = await rag.validateDocument(
        iepUpload.buffer,
        iepUpload.mimeType,
      );

      if (!behaviorValidation.isRelevant || !iepValidation.isRelevant) {
        const issuedWarningId = await createWarningId(
          session.id,
          "behavior-report",
          uploadPairHash,
        );

        return NextResponse.json<ApiResponse<BehaviorReportAnalysis>>(
          {
            ok: false,
            type: "warning",
            code: "LIKELY_IRRELEVANT",
            message: !behaviorValidation.isRelevant
              ? behaviorValidation.reason
              : iepValidation.reason,
            warningId: issuedWarningId,
          },
          { status: 422 },
        );
      }
    }

    const analysis = await rag.analyzeBehaviorReport(
      behaviorUpload.buffer,
      iepUpload.buffer,
      behaviorUpload.mimeType,
    );

    return NextResponse.json<ApiResponse<BehaviorReportAnalysis>>({
      ok: true,
      data: analysis,
    });
  } catch (error) {
    return errorResponse(error);
  }
}

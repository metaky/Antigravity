import { NextRequest, NextResponse } from "next/server";
import { RagEngine } from "@/lib/rag-engine";
import type {
  ApiResponse,
  BehaviorReportAnalysis,
} from "@/lib/server/api-types";
import { getServerConfig } from "@/lib/server/config";
import { isPublicApiError, PublicApiError } from "@/lib/server/errors";
import { consumeSessionQuota, requireVerifiedSession } from "@/lib/server/security";
import {
  looksLikeRelevantSchoolDocument,
  preflightPdfUpload,
} from "@/lib/server/uploads";

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

    const combinedText = `${behaviorUpload.extractedText} ${iepUpload.extractedText}`;
    if (!looksLikeRelevantSchoolDocument(combinedText)) {
      throw new PublicApiError(
        "These uploads do not appear to be a behavior report and school support document.",
        422,
        "LIKELY_IRRELEVANT",
      );
    }

    await consumeSessionQuota(req, "behavior-report");

    const rag = new RagEngine();
    const behaviorValidation = await rag.validateDocument(
      behaviorUpload.buffer,
      behaviorUpload.mimeType,
    );
    const iepValidation = await rag.validateDocument(
      iepUpload.buffer,
      iepUpload.mimeType,
    );

    if (!behaviorValidation.isRelevant || !iepValidation.isRelevant) {
      throw new PublicApiError(
        !behaviorValidation.isRelevant
          ? behaviorValidation.reason
          : iepValidation.reason,
        422,
        "LIKELY_IRRELEVANT",
      );
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

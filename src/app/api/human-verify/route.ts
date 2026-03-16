import { NextRequest, NextResponse } from "next/server";
import { getServerConfig } from "@/lib/server/config";
import type { ApiResponse } from "@/lib/server/api-types";
import {
  createVerifiedSession,
  enforceHumanVerifyRateLimit,
  getClientIp,
} from "@/lib/server/security";
import { isPublicApiError, PublicApiError } from "@/lib/server/errors";

type HumanVerifyBody = {
  token?: string;
  purpose?: "analyze" | "behavior-report";
};

async function verifyTurnstileToken(req: NextRequest, token: string) {
  const config = getServerConfig();

  if (config.turnstile.allowTestTokens && token === config.turnstile.testToken) {
    return;
  }

  if (!config.turnstile.secretKey) {
    throw new PublicApiError(
      "Human verification is not configured.",
      503,
      "VERIFY_UNAVAILABLE",
      true,
    );
  }

  const body = new URLSearchParams();
  body.set("secret", config.turnstile.secretKey);
  body.set("response", token);
  body.set("remoteip", getClientIp(req));

  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      body,
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new PublicApiError(
      "Human verification is temporarily unavailable.",
      503,
      "VERIFY_UNAVAILABLE",
      true,
    );
  }

  const payload = (await response.json()) as { success?: boolean };
  if (!payload.success) {
    throw new PublicApiError(
      "Human verification failed. Please try again.",
      403,
      "VERIFY_FAILED",
    );
  }
}

export async function POST(req: NextRequest) {
  const config = getServerConfig();
  if (config.maintenanceMode) {
    return NextResponse.json<ApiResponse<{ verified: boolean }>>(
      {
        ok: false,
        type: "retryable_error",
        code: "FEATURE_DISABLED",
        message: "Verification is unavailable while maintenance mode is enabled.",
      },
      { status: 503 },
    );
  }

  try {
    await enforceHumanVerifyRateLimit(req);

    const body = (await req.json()) as HumanVerifyBody;
    if (
      !body.token ||
      (body.purpose !== "analyze" && body.purpose !== "behavior-report")
    ) {
      throw new PublicApiError(
        "A verification token and upload purpose are required.",
        400,
        "VERIFY_INPUT_INVALID",
      );
    }

    const isFeatureEnabled =
      body.purpose === "analyze"
        ? config.features.analyze
        : config.features.behaviorReport;
    if (!isFeatureEnabled) {
      throw new PublicApiError(
        "That feature is currently unavailable.",
        503,
        "FEATURE_DISABLED",
        true,
      );
    }

    await verifyTurnstileToken(req, body.token);
    await createVerifiedSession(req, body.purpose);

    return NextResponse.json<ApiResponse<{ verified: boolean }>>({
      ok: true,
      data: { verified: true },
    });
  } catch (error) {
    if (isPublicApiError(error)) {
      return NextResponse.json<ApiResponse<{ verified: boolean }>>(
        {
          ok: false,
          type: error.retryable ? "retryable_error" : "error",
          code: error.code,
          message: error.message,
        },
        { status: error.status },
      );
    }

    console.error("Unexpected human verify error:", error);
    return NextResponse.json<ApiResponse<{ verified: boolean }>>(
      {
        ok: false,
        type: "retryable_error",
        code: "VERIFY_UNAVAILABLE",
        message: "Human verification is temporarily unavailable.",
      },
      { status: 503 },
    );
  }
}

import { NextResponse } from "next/server";
import {
  getHumanVerificationMode,
  getServerConfig,
} from "@/lib/server/config";
import { getSecurityStore } from "@/lib/server/security-store";

export async function GET() {
  const config = getServerConfig();
  const store = getSecurityStore();

  return NextResponse.json({
    ok: true,
    maintenanceMode: config.maintenanceMode,
    features: config.features,
    mockMode: config.mockMode,
    securityStoreReady: Boolean(store),
    modelConfigured: config.mockMode || Boolean(config.models.geminiApiKey),
    turnstileConfigured: getHumanVerificationMode(config) !== "unconfigured",
  });
}

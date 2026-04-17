import { AnalyzePageClient } from "@/components/analyze-page-client";
import {
  getHumanVerificationMode,
  getServerConfig,
} from "@/lib/server/config";

// These analyzer pages must read runtime env because Cloud Run build-time and
// runtime configuration can differ.
export const dynamic = "force-dynamic";

type AnalyzePageProps = {
  searchParams?: Promise<{ preview?: string }>;
};

export default async function AnalyzePage({ searchParams }: AnalyzePageProps) {
  const config = getServerConfig();
  const params = searchParams ? await searchParams : undefined;
  const previewMaintenance =
    process.env.NODE_ENV !== "production" && params?.preview === "maintenance";

  return (
    <AnalyzePageClient
      featureEnabled={config.features.analyze && !previewMaintenance}
      maintenanceMode={config.maintenanceMode || previewMaintenance}
      historyLimit={config.history.retentionCap}
      humanVerificationMode={getHumanVerificationMode(config)}
      turnstileSiteKey={config.turnstile.siteKey}
    />
  );
}

import { BehaviorReportPageClient } from "@/components/behavior-report-page-client";
import {
  getHumanVerificationMode,
  getServerConfig,
} from "@/lib/server/config";

// These analyzer pages must read runtime env because Cloud Run build-time and
// runtime configuration can differ.
export const dynamic = "force-dynamic";

export default function BehaviorReportPage() {
  const config = getServerConfig();

  return (
    <BehaviorReportPageClient
      featureEnabled={config.features.behaviorReport}
      maintenanceMode={config.maintenanceMode}
      historyLimit={config.history.retentionCap}
      humanVerificationMode={getHumanVerificationMode(config)}
      turnstileSiteKey={config.turnstile.siteKey}
    />
  );
}

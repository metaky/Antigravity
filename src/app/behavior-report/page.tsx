import { BehaviorReportPageClient } from "@/components/behavior-report-page-client";
import { getServerConfig } from "@/lib/server/config";

export default function BehaviorReportPage() {
  const config = getServerConfig();

  return (
    <BehaviorReportPageClient
      featureEnabled={config.features.behaviorReport}
      maintenanceMode={config.maintenanceMode}
      historyLimit={config.history.retentionCap}
    />
  );
}

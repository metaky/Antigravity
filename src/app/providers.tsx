"use client";

import { PropsWithChildren, Suspense, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import analytics, { type ConsentValue } from "@/services/analytics";

function AnalyticsPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [consent, setConsent] = useState<ConsentValue | null>(null);

  useEffect(() => {
    setConsent(analytics.getStoredConsent());

    const handleConsentChange = (event: Event) => {
      const customEvent = event as CustomEvent<ConsentValue>;
      setConsent(customEvent.detail);
    };

    window.addEventListener("cookie-consent-change", handleConsentChange);
    return () =>
      window.removeEventListener("cookie-consent-change", handleConsentChange);
  }, []);

  useEffect(() => {
    if (consent !== "granted" || !pathname) {
      return;
    }

    let url = `${window.location.origin}${pathname}`;
    if (searchParams?.toString()) {
      url = `${url}?${searchParams.toString()}`;
    }

    analytics.trackEvent("$pageview", {
      $current_url: url,
    });
  }, [consent, pathname, searchParams]);

  return null;
}

export function PHProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    analytics.ensureInitialized();
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <AnalyticsPageView />
      </Suspense>
      {children}
    </>
  );
}

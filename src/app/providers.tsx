"use client";

import { PropsWithChildren, Suspense, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import analytics from "@/services/analytics";

function AnalyticsPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasSeenInitialRouteRender = useRef(false);

  useEffect(() => {
    analytics.trackEvent("$pageview", {
      $current_url: window.location.href,
    });
  }, []);

  useEffect(() => {
    if (!pathname) {
      return;
    }

    if (!hasSeenInitialRouteRender.current) {
      hasSeenInitialRouteRender.current = true;
      return;
    }

    let url = `${window.location.origin}${pathname}`;
    if (searchParams?.toString()) {
      url = `${url}?${searchParams.toString()}`;
    }

    analytics.trackEvent("$pageview", {
      $current_url: url,
    });
  }, [pathname, searchParams]);

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

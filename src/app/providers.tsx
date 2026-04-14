"use client";

import { PropsWithChildren, useEffect } from "react";
import analytics from "@/services/analytics";

function trackCurrentPageview() {
  analytics.trackEvent("$pageview", {
    $current_url: window.location.href,
  });
}

export function PHProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    analytics.ensureInitialized();
    trackCurrentPageview();

    const handleNavigation = () => {
      window.setTimeout(trackCurrentPageview, 0);
    };

    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function (...args) {
      const result = originalPushState.apply(this, args);
      handleNavigation();
      return result;
    };

    window.history.replaceState = function (...args) {
      const result = originalReplaceState.apply(this, args);
      handleNavigation();
      return result;
    };

    window.addEventListener("popstate", handleNavigation);

    return () => {
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
      window.removeEventListener("popstate", handleNavigation);
    };
  }, []);

  return children;
}

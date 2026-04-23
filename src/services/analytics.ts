"use client";

import posthog from "posthog-js";
import {
  isAnalyticsEnabledByPreference,
  isDoNotTrackEnabled,
  parseConsentValue,
  type ConsentValue,
} from "@/lib/client/analytics-consent";

export type { ConsentValue } from "@/lib/client/analytics-consent";

const CONSENT_KEY = "cookie_consent";
let initialized = false;

function isAnalyticsDebugEnabled() {
  if (typeof window === "undefined") {
    return false;
  }

  return new URLSearchParams(window.location.search).has("__analytics_debug");
}

function logAnalyticsDebug(message: string, details?: Record<string, unknown>) {
  if (!isAnalyticsDebugEnabled()) {
    return;
  }

  console.log("[PDA analytics]", message, details ?? {});
}

function getStoredConsent(): ConsentValue | null {
  if (typeof window === "undefined") {
    return null;
  }

  return parseConsentValue(window.localStorage.getItem(CONSENT_KEY));
}

function isBrowserDoNotTrackEnabled() {
  if (typeof window === "undefined") {
    return false;
  }

  const legacyWindow = window as Window & typeof globalThis & {
    doNotTrack?: string;
  };
  const legacyNavigator = window.navigator as Navigator & {
    msDoNotTrack?: string;
  };

  return isDoNotTrackEnabled([
    window.navigator.doNotTrack,
    legacyWindow.doNotTrack,
    legacyNavigator.msDoNotTrack,
  ]);
}

function shouldInitAnalytics() {
  const enabled =
    typeof window !== "undefined" &&
    isAnalyticsEnabledByPreference({
      posthogKey: process.env.NEXT_PUBLIC_POSTHOG_KEY,
      consent: getStoredConsent(),
      doNotTrack: isBrowserDoNotTrackEnabled(),
    });

  logAnalyticsDebug("shouldInitAnalytics", {
    enabled,
    consent: getStoredConsent(),
    doNotTrack: isBrowserDoNotTrackEnabled(),
    hasPosthogKey: Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY),
  });

  return enabled;
}

function ensureInitialized() {
  if (!shouldInitAnalytics() || initialized) {
    logAnalyticsDebug("ensureInitialized skipped", {
      initialized,
    });
    return false;
  }

  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
    api_host:
      process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
    person_profiles: "identified_only",
    capture_pageview: false,
    autocapture: false,
    disable_session_recording: false,
    session_recording: {
      // Keep replays useful for flow debugging while excluding tool output.
      maskAllInputs: true,
      maskTextSelector: "[data-ph-mask]",
      blockSelector: "[data-ph-no-capture]",
    },
  });
  initialized = true;
  logAnalyticsDebug("ensureInitialized completed");
  return true;
}

function setConsent(consent: ConsentValue) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(CONSENT_KEY, consent);
  window.dispatchEvent(
    new CustomEvent("cookie-consent-change", {
      detail: consent,
    }),
  );

  if (consent === "granted") {
    ensureInitialized();
    posthog.opt_in_capturing();
  } else if (initialized) {
    posthog.opt_out_capturing();
  }
}

function trackEvent(eventName: string, properties?: Record<string, unknown>) {
  if (!shouldInitAnalytics()) {
    logAnalyticsDebug("trackEvent skipped", {
      eventName,
    });
    return;
  }

  ensureInitialized();
  logAnalyticsDebug("trackEvent capture", {
    eventName,
    properties,
  });
  posthog.capture(
    eventName,
    properties,
    eventName === "$pageview" ? { send_instantly: true } : undefined,
  );
}

const analytics = {
  getStoredConsent,
  ensureInitialized,
  setConsent,
  trackEvent,
  isBrowserDoNotTrackEnabled,
};

export default analytics;

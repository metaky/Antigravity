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
  return (
    typeof window !== "undefined" &&
    isAnalyticsEnabledByPreference({
      posthogKey: process.env.NEXT_PUBLIC_POSTHOG_KEY,
      consent: getStoredConsent(),
      doNotTrack: isBrowserDoNotTrackEnabled(),
    })
  );
}

function ensureInitialized() {
  if (!shouldInitAnalytics() || initialized) {
    return false;
  }

  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
    api_host:
      process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
    person_profiles: "identified_only",
    capture_pageview: true,
    autocapture: false,
    disable_session_recording: true,
  });
  initialized = true;
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
    return;
  }

  ensureInitialized();
  posthog.capture(eventName, properties);
}

const analytics = {
  getStoredConsent,
  ensureInitialized,
  setConsent,
  trackEvent,
  isBrowserDoNotTrackEnabled,
};

export default analytics;

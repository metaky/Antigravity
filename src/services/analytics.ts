"use client";

import posthog from "posthog-js";

const CONSENT_KEY = "cookie_consent";
let initialized = false;

export type ConsentValue = "granted" | "denied";

function getStoredConsent(): ConsentValue | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(CONSENT_KEY);
  return raw === "granted" || raw === "denied" ? raw : null;
}

function shouldInitAnalytics() {
  return (
    typeof window !== "undefined" &&
    Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY) &&
    getStoredConsent() === "granted"
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
    capture_pageview: false,
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
};

export default analytics;

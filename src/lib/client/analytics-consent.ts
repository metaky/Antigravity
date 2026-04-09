export type ConsentValue = "granted" | "denied";

type AnalyticsPreferenceInput = {
  posthogKey: string | null | undefined;
  consent: ConsentValue | null;
  doNotTrack: boolean;
};

const DO_NOT_TRACK_ENABLED_VALUES = new Set(["1", "yes"]);

export function parseConsentValue(raw: string | null): ConsentValue | null {
  return raw === "granted" || raw === "denied" ? raw : null;
}

export function isDoNotTrackEnabled(
  signals: Array<string | null | undefined>,
): boolean {
  return signals.some((signal) => {
    if (typeof signal !== "string") {
      return false;
    }

    return DO_NOT_TRACK_ENABLED_VALUES.has(signal.toLowerCase());
  });
}

export function isAnalyticsEnabledByPreference({
  posthogKey,
  consent,
  doNotTrack,
}: AnalyticsPreferenceInput): boolean {
  return Boolean(posthogKey) && consent !== "denied" && !doNotTrack;
}

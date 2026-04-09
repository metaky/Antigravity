import { expect, test } from "@playwright/test";
import {
  isAnalyticsEnabledByPreference,
  isDoNotTrackEnabled,
  parseConsentValue,
} from "@/lib/client/analytics-consent";

test.describe("analytics consent rules", () => {
  test("treats missing consent as enabled until a visitor declines", () => {
    expect(
      isAnalyticsEnabledByPreference({
        posthogKey: "phc_test",
        consent: null,
        doNotTrack: false,
      }),
    ).toBeTruthy();
  });

  test("keeps granted consent enabled and denied consent disabled", () => {
    expect(
      isAnalyticsEnabledByPreference({
        posthogKey: "phc_test",
        consent: "granted",
        doNotTrack: false,
      }),
    ).toBeTruthy();

    expect(
      isAnalyticsEnabledByPreference({
        posthogKey: "phc_test",
        consent: "denied",
        doNotTrack: false,
      }),
    ).toBeFalsy();
  });

  test("disables analytics when Do Not Track is enabled or the key is missing", () => {
    expect(
      isAnalyticsEnabledByPreference({
        posthogKey: "phc_test",
        consent: null,
        doNotTrack: true,
      }),
    ).toBeFalsy();

    expect(
      isAnalyticsEnabledByPreference({
        posthogKey: null,
        consent: null,
        doNotTrack: false,
      }),
    ).toBeFalsy();
  });

  test("recognizes common browser Do Not Track signals", () => {
    expect(isDoNotTrackEnabled(["1"])).toBeTruthy();
    expect(isDoNotTrackEnabled(["yes"])).toBeTruthy();
    expect(isDoNotTrackEnabled([undefined, "0"])).toBeFalsy();
  });

  test("parses only supported stored consent values", () => {
    expect(parseConsentValue("granted")).toBe("granted");
    expect(parseConsentValue("denied")).toBe("denied");
    expect(parseConsentValue("unexpected")).toBeNull();
    expect(parseConsentValue(null)).toBeNull();
  });
});

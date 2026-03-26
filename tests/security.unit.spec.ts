import { expect, test } from "@playwright/test";
import { PublicApiError } from "@/lib/server/errors";
import { parseStoredJson } from "@/lib/server/security";

test.describe("parseStoredJson", () => {
  test("parses serialized JSON strings", () => {
    expect(parseStoredJson<{ ok: boolean }>('{"ok":true}')).toEqual({ ok: true });
  });

  test("accepts already-parsed objects from the store", () => {
    expect(parseStoredJson<{ ok: boolean }>({ ok: true })).toEqual({ ok: true });
  });

  test("rejects unsupported primitive values", () => {
    expect(() => parseStoredJson(42)).toThrow(PublicApiError);
  });
});

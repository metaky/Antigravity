import { expect, test } from "@playwright/test";
import {
  getServerConfig,
  resetServerConfigForTests,
} from "@/lib/server/config";
import { resetSecurityStoreForTests } from "@/lib/server/security-store";

const DEFAULT_ENV = {
  FEATURE_ANALYZE_ENABLED: process.env.FEATURE_ANALYZE_ENABLED,
  FEATURE_BEHAVIOR_REPORT_ENABLED: process.env.FEATURE_BEHAVIOR_REPORT_ENABLED,
  SECURITY_USE_MEMORY_STORE: process.env.SECURITY_USE_MEMORY_STORE,
  SECURITY_ALLOW_TEST_TOKENS: process.env.SECURITY_ALLOW_TEST_TOKENS,
  SESSION_SIGNING_SECRET: process.env.SESSION_SIGNING_SECRET,
  RAG_MOCK_MODE: process.env.RAG_MOCK_MODE,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
};

function restoreEnv() {
  for (const [key, value] of Object.entries(DEFAULT_ENV)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
  resetServerConfigForTests();
  resetSecurityStoreForTests();
}

test.describe("server config validation", () => {
  test.afterEach(() => {
    restoreEnv();
  });

  test("fails fast when features are enabled without a signing secret", () => {
    process.env.FEATURE_ANALYZE_ENABLED = "true";
    process.env.SECURITY_USE_MEMORY_STORE = "true";
    process.env.SECURITY_ALLOW_TEST_TOKENS = "true";
    process.env.RAG_MOCK_MODE = "true";
    delete process.env.SESSION_SIGNING_SECRET;
    resetServerConfigForTests();

    expect(() => getServerConfig()).toThrow(
      /SESSION_SIGNING_SECRET/,
    );
  });

  test("accepts the hardened local test configuration", () => {
    process.env.FEATURE_ANALYZE_ENABLED = "true";
    process.env.FEATURE_BEHAVIOR_REPORT_ENABLED = "true";
    process.env.SECURITY_USE_MEMORY_STORE = "true";
    process.env.SECURITY_ALLOW_TEST_TOKENS = "true";
    process.env.SESSION_SIGNING_SECRET = "unit-test-signing-secret";
    process.env.RAG_MOCK_MODE = "true";
    resetServerConfigForTests();

    const config = getServerConfig();

    expect(config.features.analyze).toBeTruthy();
    expect(config.features.behaviorReport).toBeTruthy();
    expect(config.security.useMemoryStore).toBeTruthy();
    expect(config.security.signingSecret).toBe("unit-test-signing-secret");
    expect(config.mockMode).toBeTruthy();
  });
});

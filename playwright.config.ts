import { defineConfig, devices } from "@playwright/test";

const enabledEnv = {
  HOST: "127.0.0.1",
  PORT: "3000",
  FEATURE_ANALYZE_ENABLED: "true",
  FEATURE_BEHAVIOR_REPORT_ENABLED: "true",
  MAINTENANCE_MODE: "false",
  RAG_MOCK_MODE: "true",
  SECURITY_USE_MEMORY_STORE: "true",
  SECURITY_ALLOW_TEST_TOKENS: "true",
  SECURITY_TEST_TOKEN: "codex-turnstile-test-token",
  HUMAN_VERIFY_MAX_ATTEMPTS: "100",
  ANALYZE_IP_MAX_ATTEMPTS: "100",
  BEHAVIOR_IP_MAX_ATTEMPTS: "100",
  SESSION_SIGNING_SECRET: "playwright-signing-secret",
  NEXT_PUBLIC_SECURITY_TEST_MODE: "true",
  NEXT_PUBLIC_SECURITY_TEST_TOKEN: "codex-turnstile-test-token",
};

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://127.0.0.1:3000",
    env: enabledEnv,
    reuseExistingServer: !process.env.CI,
  },
});

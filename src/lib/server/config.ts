type FeatureKey = "analyze" | "behaviorReport";

type ServerConfig = {
  features: Record<FeatureKey, boolean>;
  maintenanceMode: boolean;
  mockMode: boolean;
  security: {
    sessionCookieName: string;
    sessionTtlSeconds: number;
    warningTtlSeconds: number;
    analyzeQuota: number;
    behaviorReportQuota: number;
    humanVerifyWindowSeconds: number;
    humanVerifyMaxAttempts: number;
    analyzeIpWindowSeconds: number;
    analyzeIpMaxAttempts: number;
    behaviorIpWindowSeconds: number;
    behaviorIpMaxAttempts: number;
    signingSecret: string | null;
    browserIdHeader: string;
    useMemoryStore: boolean;
    upstashUrl: string | null;
    upstashToken: string | null;
  };
  turnstile: {
    siteKey: string | null;
    secretKey: string | null;
    allowTestTokens: boolean;
    testToken: string;
  };
  uploads: {
    maxFileBytes: number;
    maxPdfPages: number;
    maxPageWidth: number;
    maxPageHeight: number;
    minExtractedTextLength: number;
  };
  models: {
    geminiApiKey: string | null;
    geminiModel: string;
  };
  analytics: {
    posthogKey: string | null;
    posthogHost: string;
  };
  history: {
    retentionCap: number;
  };
};

let cachedConfig: ServerConfig | null = null;

function parseBoolean(value: string | undefined, fallback = false) {
  if (value === undefined) {
    return fallback;
  }

  return value === "true";
}

function parseNumber(value: string | undefined, fallback: number) {
  if (value === undefined) {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function validateConfig(config: ServerConfig) {
  const featureEnabled =
    config.features.analyze || config.features.behaviorReport;

  if (!featureEnabled) {
    return config;
  }

  if (
    !config.security.useMemoryStore &&
    (!config.security.upstashUrl || !config.security.upstashToken)
  ) {
    throw new Error(
      "FEATURE_*_ENABLED requires Upstash Redis or SECURITY_USE_MEMORY_STORE=true.",
    );
  }

  if (!config.turnstile.allowTestTokens && !config.turnstile.secretKey) {
    throw new Error(
      "FEATURE_*_ENABLED requires TURNSTILE_SECRET_KEY or SECURITY_ALLOW_TEST_TOKENS=true.",
    );
  }

  if (!config.security.signingSecret) {
    throw new Error(
      "FEATURE_*_ENABLED requires SESSION_SIGNING_SECRET for warning/session protection.",
    );
  }

  if (!config.mockMode && !config.models.geminiApiKey) {
    throw new Error(
      "FEATURE_*_ENABLED requires GEMINI_API_KEY unless RAG_MOCK_MODE=true.",
    );
  }

  return config;
}

export function getServerConfig(): ServerConfig {
  if (cachedConfig) {
    return cachedConfig;
  }

  cachedConfig = validateConfig({
    features: {
      analyze: parseBoolean(process.env.FEATURE_ANALYZE_ENABLED, false),
      behaviorReport: parseBoolean(
        process.env.FEATURE_BEHAVIOR_REPORT_ENABLED,
        false,
      ),
    },
    maintenanceMode: parseBoolean(process.env.MAINTENANCE_MODE, true),
    mockMode: parseBoolean(process.env.RAG_MOCK_MODE, false),
    security: {
      sessionCookieName:
        process.env.SESSION_COOKIE_NAME ?? "pda_verified_session",
      sessionTtlSeconds: parseNumber(process.env.SESSION_TTL_SECONDS, 600),
      warningTtlSeconds: parseNumber(process.env.WARNING_TTL_SECONDS, 300),
      analyzeQuota: parseNumber(process.env.ANALYZE_SESSION_QUOTA, 3),
      behaviorReportQuota: parseNumber(
        process.env.BEHAVIOR_REPORT_SESSION_QUOTA,
        2,
      ),
      humanVerifyWindowSeconds: parseNumber(
        process.env.HUMAN_VERIFY_WINDOW_SECONDS,
        300,
      ),
      humanVerifyMaxAttempts: parseNumber(
        process.env.HUMAN_VERIFY_MAX_ATTEMPTS,
        5,
      ),
      analyzeIpWindowSeconds: parseNumber(
        process.env.ANALYZE_IP_WINDOW_SECONDS,
        600,
      ),
      analyzeIpMaxAttempts: parseNumber(
        process.env.ANALYZE_IP_MAX_ATTEMPTS,
        6,
      ),
      behaviorIpWindowSeconds: parseNumber(
        process.env.BEHAVIOR_IP_WINDOW_SECONDS,
        600,
      ),
      behaviorIpMaxAttempts: parseNumber(
        process.env.BEHAVIOR_IP_MAX_ATTEMPTS,
        4,
      ),
      signingSecret: process.env.SESSION_SIGNING_SECRET ?? null,
      browserIdHeader: "x-browser-id",
      useMemoryStore: parseBoolean(
        process.env.SECURITY_USE_MEMORY_STORE,
        false,
      ),
      upstashUrl: process.env.UPSTASH_REDIS_REST_URL ?? null,
      upstashToken: process.env.UPSTASH_REDIS_REST_TOKEN ?? null,
    },
    turnstile: {
      siteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? null,
      secretKey: process.env.TURNSTILE_SECRET_KEY ?? null,
      allowTestTokens: parseBoolean(
        process.env.SECURITY_ALLOW_TEST_TOKENS,
        false,
      ),
      testToken:
        process.env.SECURITY_TEST_TOKEN ?? "codex-turnstile-test-token",
    },
    uploads: {
      maxFileBytes: parseNumber(process.env.UPLOAD_MAX_FILE_BYTES, 10 * 1024 * 1024),
      maxPdfPages: parseNumber(process.env.UPLOAD_MAX_PDF_PAGES, 120),
      maxPageWidth: parseNumber(process.env.UPLOAD_MAX_PAGE_WIDTH, 2000),
      maxPageHeight: parseNumber(process.env.UPLOAD_MAX_PAGE_HEIGHT, 2000),
      minExtractedTextLength: parseNumber(
        process.env.UPLOAD_MIN_TEXT_LENGTH,
        40,
      ),
    },
    models: {
      geminiApiKey: process.env.GEMINI_API_KEY ?? null,
      geminiModel: process.env.GEMINI_MODEL ?? "gemini-3-flash-preview",
    },
    analytics: {
      posthogKey: process.env.NEXT_PUBLIC_POSTHOG_KEY ?? null,
      posthogHost:
        process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
    },
    history: {
      retentionCap: parseNumber(process.env.NEXT_PUBLIC_HISTORY_RETENTION_CAP, 5),
    },
  });

  return cachedConfig;
}

export function resetServerConfigForTests() {
  cachedConfig = null;
}

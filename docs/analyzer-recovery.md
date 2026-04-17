# Analyzer Recovery

## Local recovery

Set these values in your local env before testing live Gemini output:

```bash
FEATURE_ANALYZE_ENABLED=true
FEATURE_BEHAVIOR_REPORT_ENABLED=true
MAINTENANCE_MODE=false
RAG_MOCK_MODE=false
GEMINI_API_KEY=...
SESSION_SIGNING_SECRET=...
SECURITY_USE_MEMORY_STORE=true
# Keep test-token verification for private localhost development only.
SECURITY_ALLOW_TEST_TOKENS=true
SECURITY_TEST_TOKEN=codex-turnstile-test-token
NEXT_PUBLIC_SECURITY_TEST_MODE=true
NEXT_PUBLIC_SECURITY_TEST_TOKEN=codex-turnstile-test-token
UPLOAD_MAX_FILE_BYTES=20971520
UPLOAD_MAX_PDF_PAGES=200
```

Do not carry the test-token settings above into any shared, staged, or public-facing environment. They are only for private local recovery on `127.0.0.1`.

Local recovery should rely on the default built-in rate limits unless you are explicitly running isolated test automation:

- `HUMAN_VERIFY_MAX_ATTEMPTS=5`
- `ANALYZE_IP_MAX_ATTEMPTS=6`
- `BEHAVIOR_IP_MAX_ATTEMPTS=4`

Recommended recovery flow:

```bash
npm run test:guards
npm run check:gemini-models
npm run dev
npm run smoke:live
```

Testing notes:

- `npm run dev` now binds to `127.0.0.1`, so manual browser testing should use `http://localhost:3000` on the same machine.
- If a future tester needs cross-device manual testing, they must intentionally override the host binding instead of assuming the dev server is LAN-accessible.
- Normal local runs should not restore the old `100`-attempt rate-limit overrides. Those settings are only appropriate for isolated automation when you fully control the caller.
- `playwright.config.ts` still injects its own test-only env, including permissive verification and upload-limit settings, so automated safeguard tests remain deterministic even though everyday local development is now tighter.
- Run `npm run test:guards` without `PLAYWRIGHT_DISABLE_WEBSERVER` so Playwright boots that isolated test server. Reusing an already-running local dev server will inherit everyday rate limits and can produce misleading failures.
- If you run several automated checks first, restart `npm run dev` before manual browser testing. The local in-memory security store keeps rate-limit and quota counters for the life of that server process.

`npm run test:guards` validates the safeguard and UX contract in mock mode.

`npm run check:gemini-models` reads `.env.local`, confirms that the configured `GEMINI_MODEL` is available to the active API key, and exits non-zero if the configured model is unavailable.

`npm run smoke:live` reads `.env.local`, expects a local server on `http://127.0.0.1:3000`, hits `/api/health`, verifies a human session for each analyzer, submits the fixture PDFs, and prints a compact summary of both responses.

## Production checklist for Cloud Run

1. Store `GEMINI_API_KEY` in Secret Manager.
2. Inject it into the Cloud Run service as `GEMINI_API_KEY`.
3. Set:
   - `FEATURE_ANALYZE_ENABLED=true`
   - `FEATURE_BEHAVIOR_REPORT_ENABLED=true`
   - `MAINTENANCE_MODE=false`
   - `RAG_MOCK_MODE=false`
4. Confirm these are present:
   - `SESSION_SIGNING_SECRET`
   - `TURNSTILE_SECRET_KEY`
   - `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
5. Keep these off in production:
   - `SECURITY_ALLOW_TEST_TOKENS`
   - `NEXT_PUBLIC_SECURITY_TEST_MODE`
6. Redeploy and verify `/api/health` returns:
   - `"maintenanceMode": false`
   - `"mockMode": false`
   - `"modelConfigured": true`
   - `"securityStoreReady": true`
   - `"turnstileConfigured": true`

## Manual output review

For IEP analysis, confirm:

- the score is plausible
- the summary is specific and parent-useful
- quotes and page numbers map back to the source PDF
- recommendations are PDA-aligned and not generic filler

For behavior report analysis, confirm:

- the summary distinguishes what happened from what supports were missing
- the `iepGuidance` section cites the right source document
- PDA considerations are concrete and actionable

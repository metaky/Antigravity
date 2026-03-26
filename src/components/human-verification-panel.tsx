"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import { getSecurityHeaders, getSecurityTestToken } from "@/lib/client/security";
import type { HumanVerificationMode } from "@/lib/human-verification";

declare global {
  interface Window {
    turnstile?: {
      render: (
        element: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "error-callback"?: () => void;
        },
      ) => string;
      remove: (widgetId: string) => void;
    };
  }
}

type HumanVerificationPanelProps = {
  open: boolean;
  purpose: "analyze" | "behavior-report";
  verificationMode: HumanVerificationMode;
  turnstileSiteKey: string | null;
  onClose: () => void;
  onVerified: () => void;
};

export function HumanVerificationPanel({
  open,
  purpose,
  verificationMode,
  turnstileSiteKey,
  onClose,
  onVerified,
}: HumanVerificationPanelProps) {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTurnstileReady, setIsTurnstileReady] = useState(false);
  const widgetContainerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);

  const submitToken = useCallback(async (token: string) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/human-verify", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...getSecurityHeaders(),
        },
        body: JSON.stringify({ token, purpose }),
      });
      const data = (await response.json()) as {
        ok: boolean;
        message?: string;
      };

      if (!data.ok) {
        setError(data.message ?? "Verification failed.");
        return;
      }

      onVerified();
    } catch {
      setError("Verification failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [onVerified, purpose]);

  useEffect(() => {
    if (verificationMode !== "turnstile") {
      setIsTurnstileReady(false);
      return;
    }

    setIsTurnstileReady(Boolean(window.turnstile));
  }, [verificationMode]);

  useEffect(() => {
    if (
      !open ||
      verificationMode !== "turnstile" ||
      !turnstileSiteKey ||
      !isTurnstileReady ||
      !window.turnstile ||
      !widgetContainerRef.current
    ) {
      return;
    }

    widgetIdRef.current = window.turnstile.render(widgetContainerRef.current, {
      sitekey: turnstileSiteKey,
      callback: (token) => {
        void submitToken(token);
      },
      "error-callback": () => {
        setError("Verification failed to load. Please try again.");
      },
    });

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [isTurnstileReady, open, submitToken, turnstileSiteKey, verificationMode]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm p-4 flex items-center justify-center">
      {verificationMode === "turnstile" && turnstileSiteKey ? (
        <Script
          id="turnstile-api"
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          onReady={() => setIsTurnstileReady(true)}
          strategy="afterInteractive"
        />
      ) : null}

      <div className="bg-white max-w-md w-full rounded-2xl shadow-xl border p-6 space-y-4">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Complete security check</h2>
          <p className="text-sm text-slate-600">
            We verify a human session only when you start an upload, which helps
            protect the API from automated abuse.
          </p>
        </div>

        {verificationMode === "test" ? (
          <Button
            className="w-full"
            onClick={() => void submitToken(getSecurityTestToken())}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Verifying..." : "Complete security check"}
          </Button>
        ) : verificationMode === "turnstile" && turnstileSiteKey ? (
          <div className="min-h-16 flex items-center justify-center" ref={widgetContainerRef} />
        ) : (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            Human verification is not configured yet for this environment.
          </div>
        )}

        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import analytics, { type ConsentValue } from "@/services/analytics";

export function CookieBanner() {
  const [consent, setConsent] = useState<ConsentValue | null | "loading">(
    "loading",
  );

  useEffect(() => {
    setConsent(analytics.getStoredConsent());
  }, []);

  const handleAccept = () => {
    analytics.setConsent("granted");
    setConsent("granted");
  };

  const handleDecline = () => {
    analytics.setConsent("denied");
    setConsent("denied");
  };

  if (consent === "loading" || consent !== null) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--wc-ochre-pale)] bg-white/95 p-4 shadow-[0_-6px_20px_-12px_rgba(0,0,0,0.18)] backdrop-blur-sm animate-in slide-in-from-bottom duration-500 print:hidden">
      <div className="container mx-auto flex max-w-5xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="max-w-3xl text-sm text-[var(--wc-brown-dark)]">
          <p className="mb-1 font-semibold text-[var(--wc-brown-darker)]">
            Anonymous analytics are on by default
          </p>
          <p>
            We use PostHog pageviews, feature usage, and session replays to
            improve PDA Your IEP. These analytics are on by default unless you
            decline them below or your browser sends a Do Not Track signal. Read
            our{" "}
            <a
              href="/privacy-policy"
              className="underline decoration-[var(--wc-ochre)] underline-offset-4 hover:text-[var(--wc-blue-dark)]"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
        <div className="flex w-full items-center gap-3 md:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDecline}
            className="flex-1 md:flex-none"
          >
            Decline analytics
          </Button>
          <Button
            size="sm"
            onClick={handleAccept}
            className="flex-1 bg-[var(--wc-blue-dark)] text-white hover:bg-[var(--wc-blue)] md:flex-none"
          >
            Keep analytics on
          </Button>
        </div>
      </div>
    </div>
  );
}

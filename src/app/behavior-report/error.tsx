"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import analytics from "@/services/analytics";
import { Button } from "@/components/ui/button";

type BehaviorReportErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function BehaviorReportErrorPage({
  error,
  reset,
}: BehaviorReportErrorPageProps) {
  useEffect(() => {
    analytics.captureException(error, {
      route: "/behavior-report",
      surface: "behavior_report_error_boundary",
      digest: error.digest,
    });
  }, [error]);

  return (
    <main className="min-h-screen bg-muted/10 px-4 py-20">
      <section className="mx-auto flex max-w-xl flex-col items-center gap-5 rounded-2xl border border-[var(--wc-ochre)]/25 bg-white p-8 text-center shadow-sm">
        <div className="rounded-full bg-[var(--wc-ochre-pale)] p-3 text-[var(--wc-ochre-dark)]">
          <AlertTriangle className="h-7 w-7" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-[var(--wc-brown-darker)]">
            We couldn&apos;t display this report
          </h1>
          <p className="text-sm leading-6 text-[var(--wc-brown-dark)]">
            The upload may have completed, but the report view hit a display
            issue. Try again, or return to the behavior report tool and upload
            the documents once more.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Button variant="watercolor" onClick={reset}>
            Try again
          </Button>
          <Button asChild variant="outline-organic">
            <Link href="/behavior-report">Back to behavior report tool</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}

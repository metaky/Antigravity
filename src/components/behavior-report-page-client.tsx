"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  BookOpen,
  Brain,
  CheckCircle,
  Clock,
  FileSearch,
  Printer,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { DualUploadZone } from "@/components/dual-upload-zone";
import { PrivacyNotice, Disclaimer } from "@/components/privacy-notice";
import { DonationPrompt } from "@/components/donation-prompt";
import { FeatureUnavailable } from "@/components/feature-unavailable";
import { HumanVerificationPanel } from "@/components/human-verification-panel";
import { Button } from "@/components/ui/button";
import type {
  ApiResponse,
  BehaviorReportAnalysis,
  BehaviorGuidanceItem,
  StoredBehaviorHistoryEntry,
} from "@/lib/server/api-types";
import type { HumanVerificationMode } from "@/lib/human-verification";
import analytics from "@/services/analytics";
import {
  clearBehaviorHistory,
  loadBehaviorHistory,
  removeBehaviorHistoryEntry,
  saveBehaviorHistory,
} from "@/lib/client/history";
import { getSecurityHeaders } from "@/lib/client/security";

type PendingBehaviorSubmission = {
  behaviorReport: File;
  iepDocument: File;
  warningId?: string;
};

type BehaviorReportPageClientProps = {
  featureEnabled: boolean;
  maintenanceMode: boolean;
  historyLimit: number;
  humanVerificationMode: HumanVerificationMode;
  turnstileSiteKey: string | null;
};

function getGuidanceBadge(item: BehaviorGuidanceItem) {
  if (item.source === "BIR") {
    return "bg-[var(--wc-ochre-pale)] text-[var(--wc-ochre-dark)] border-[var(--wc-ochre)]/20";
  }

  return "bg-[var(--wc-blue-pale)] text-[var(--wc-blue-dark)] border-[var(--wc-blue)]/20";
}

export function BehaviorReportPageClient({
  featureEnabled,
  maintenanceMode,
  historyLimit,
  humanVerificationMode,
  turnstileSiteKey,
}: BehaviorReportPageClientProps) {
  const printedAt = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date());
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<BehaviorReportAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [warningReason, setWarningReason] = useState<string | null>(null);
  const [verificationOpen, setVerificationOpen] = useState(false);
  const [pendingSubmission, setPendingSubmission] =
    useState<PendingBehaviorSubmission | null>(null);
  const [savedHistory, setSavedHistory] = useState<StoredBehaviorHistoryEntry[]>([]);
  const [fileNames, setFileNames] = useState<{ behavior: string; iep: string } | null>(
    null,
  );

  useEffect(() => {
    setSavedHistory(loadBehaviorHistory());
  }, []);

  function persistHistory(
    report: BehaviorReportAnalysis,
    behaviorFileName: string,
    iepFileName: string,
  ) {
    const next = saveBehaviorHistory(
      {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        behaviorFileName,
        iepFileName,
        summary: report.summary,
        fullReport: report,
      },
      historyLimit,
    );
    setSavedHistory(next);
  }

  function restoreHistory(entry: StoredBehaviorHistoryEntry) {
    if (!entry.fullReport) {
      setError("Only summary metadata was saved for that report.");
      return;
    }

    setFileNames({
      behavior: entry.behaviorFileName,
      iep: entry.iepFileName,
    });
    setResult(entry.fullReport);
    setError(null);
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "auto" });
    });
  }

  function removeHistoryEntry(entryId: string) {
    const remaining = removeBehaviorHistoryEntry(entryId);
    setSavedHistory(remaining);
  }

  async function submitBehaviorRequest(
    behaviorReport: File,
    iepDocument: File,
    warningId?: string,
  ) {
    setIsProcessing(true);
    setError(null);
    setWarningReason(null);
    setFileNames({ behavior: behaviorReport.name, iep: iepDocument.name });

    try {
      const formData = new FormData();
      formData.append("behaviorReport", behaviorReport);
      formData.append("iepDocument", iepDocument);
      if (warningId) {
        formData.append("warningId", warningId);
      }

      const response = await fetch("/api/behavior-report", {
        method: "POST",
        headers: getSecurityHeaders(),
        body: formData,
      });
      const data = (await response.json()) as ApiResponse<BehaviorReportAnalysis>;

      if (data.ok) {
        setResult(data.data);
        analytics.trackEvent("generated_behavior_report");
        persistHistory(data.data, behaviorReport.name, iepDocument.name);
        return;
      }

      if (
        data.code === "VERIFICATION_REQUIRED" ||
        data.code === "SESSION_EXPIRED" ||
        data.code === "SESSION_MISMATCH"
      ) {
        setPendingSubmission({ behaviorReport, iepDocument, warningId });
        setVerificationOpen(true);
        return;
      }

      if (data.type === "warning") {
        setPendingSubmission({
          behaviorReport,
          iepDocument,
          warningId: data.warningId,
        });
        setWarningReason(data.message);
        return;
      }

      setError(data.message);
    } catch {
      setError("An unexpected error occurred while analyzing the documents.");
    } finally {
      setIsProcessing(false);
    }
  }

  async function continueAfterVerification() {
    setVerificationOpen(false);
    if (!pendingSubmission) {
      return;
    }
    const next = pendingSubmission;
    setPendingSubmission(null);
    await submitBehaviorRequest(
      next.behaviorReport,
      next.iepDocument,
      next.warningId,
    );
  }

  async function proceedWithWarning() {
    if (!pendingSubmission?.warningId) {
      return;
    }

    await submitBehaviorRequest(
      pendingSubmission.behaviorReport,
      pendingSubmission.iepDocument,
      pendingSubmission.warningId,
    );
  }

  const featureUnavailable = maintenanceMode || !featureEnabled;

  return (
    <div className="min-h-screen flex flex-col bg-muted/10">
      <Navbar />
      <main className="flex-1 container mx-auto pt-40 pb-12 px-4 md:px-6 print:max-w-none print:px-0 print:pt-0 print:pb-0">
        <div className="max-w-5xl mx-auto space-y-8 print:mx-0 print:max-w-none print:space-y-4">
          <div className="text-center space-y-4 print:hidden">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Behavior Report Tool
            </h1>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Compare a behavior incident report to the student&apos;s IEP or 504 plan and
              surface missed supports, strengths, and future PDA-informed steps.
            </p>
          </div>

          {featureUnavailable ? (
            <FeatureUnavailable
              title="Out of Order"
              description="This feature is temporarily unavailable while the API hardening work is completed."
            />
          ) : result ? (
            <div className="space-y-6 print-report-shell">
              <section className="hidden print:block print-report-header">
                <div className="print-report-kicker">PDA Your IEP</div>
                <h1 className="print-report-title">Behavior Incident Analysis Report</h1>
                <p className="print-report-summary">{result.summary}</p>
                <div className="print-report-meta">
                  <div className="print-report-meta-item">
                    <span className="print-report-meta-label">Behavior report</span>
                    <span className="print-report-meta-value">
                      {fileNames?.behavior ?? "Uploaded report"}
                    </span>
                  </div>
                  <div className="print-report-meta-item">
                    <span className="print-report-meta-label">School support plan</span>
                    <span className="print-report-meta-value">
                      {fileNames?.iep ?? "Uploaded IEP or 504"}
                    </span>
                  </div>
                  <div className="print-report-meta-item">
                    <span className="print-report-meta-label">Prepared</span>
                    <span className="print-report-meta-value">{printedAt}</span>
                  </div>
                </div>
              </section>

              <section className="wc-card relative overflow-hidden p-6 md:p-8 print:hidden">
                <div className="print-decor absolute inset-0 wc-wash-blend opacity-45" aria-hidden="true" />
                <div
                  className="print-decor absolute -top-12 left-0 h-36 w-36 rounded-full bg-[var(--wc-sage)]/10 blur-3xl"
                  aria-hidden="true"
                />
                <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <div className="max-w-3xl space-y-3">
                    <div className="inline-flex items-center gap-2 rounded-full border border-[var(--wc-sage)]/20 bg-[var(--wc-sage-pale)]/80 px-3 py-1 text-sm font-semibold text-[var(--wc-sage-dark)]">
                      <FileSearch className="h-4 w-4" />
                      Behavior Incident Analysis
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold tracking-tight text-[var(--wc-brown-darker)]">
                        A clearer picture of what happened and what should change
                      </h2>
                      <p className="mt-2 text-base leading-7 text-[var(--wc-brown-dark)]">
                        {fileNames
                          ? `${fileNames.behavior} compared with ${fileNames.iep}`
                          : "Review your report below."}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline-organic" onClick={() => window.print()}>
                      <Printer className="h-4 w-4" />
                      Print / Save PDF
                    </Button>
                    <Button
                      variant="watercolor"
                      onClick={() => {
                        setResult(null);
                        setFileNames(null);
                      }}
                    >
                      Analyze Another Incident
                    </Button>
                  </div>
                </div>
              </section>

              <div className="grid gap-4 lg:grid-cols-[1.35fr_1fr]">
                <section className="wc-card print-break-avoid p-6 md:p-7">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 rounded-2xl bg-[var(--wc-ochre-pale)] p-3 text-[var(--wc-ochre-dark)]">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--wc-brown)]">
                          Executive summary
                        </p>
                        <h3 className="mt-2 text-2xl font-semibold text-[var(--wc-brown-darker)]">
                          What this incident review suggests
                        </h3>
                      </div>
                      <p className="text-base leading-7 text-[var(--wc-brown-dark)]">{result.summary}</p>
                    </div>
                  </div>
                </section>

                <section className="wc-card print-break-avoid relative overflow-hidden p-6 md:p-7">
                  <div className="print-decor absolute inset-0 wc-wash-blue opacity-60" aria-hidden="true" />
                  <div className="relative space-y-4">
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--wc-brown)]">
                      Report at a glance
                    </p>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="rounded-2xl bg-[var(--wc-paper)]/85 p-4 text-center">
                        <div className="text-3xl font-bold text-[var(--wc-brown-darker)]">
                          {result.whatWentWell.length}
                        </div>
                        <div className="mt-1 text-xs uppercase tracking-[0.18em] text-[var(--wc-brown)]">
                          strengths
                        </div>
                      </div>
                      <div className="rounded-2xl bg-[var(--wc-paper)]/85 p-4 text-center">
                        <div className="text-3xl font-bold text-[var(--wc-brown-darker)]">
                          {result.iepGuidance.length}
                        </div>
                        <div className="mt-1 text-xs uppercase tracking-[0.18em] text-[var(--wc-brown)]">
                          IEP cues
                        </div>
                      </div>
                      <div className="rounded-2xl bg-[var(--wc-paper)]/85 p-4 text-center">
                        <div className="text-3xl font-bold text-[var(--wc-brown-darker)]">
                          {result.pdaConsiderations.length}
                        </div>
                        <div className="mt-1 text-xs uppercase tracking-[0.18em] text-[var(--wc-brown)]">
                          PDA ideas
                        </div>
                      </div>
                    </div>
                    <p className="text-sm leading-6 text-[var(--wc-brown-dark)]">
                      The sections below separate supportive responses, missed supports, and next-step strategies for easier discussion with school staff.
                    </p>
                  </div>
                </section>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <section className="wc-card wc-status-good print-break-avoid p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-2xl bg-[var(--wc-paper)]/85 p-2 text-[var(--wc-sage-dark)]">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-[var(--wc-sage-dark)]">What went well</h3>
                      <p className="text-sm text-[var(--wc-brown-dark)]">
                        Steps that already support regulation and dignity.
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-3 text-sm leading-6 text-[var(--wc-brown-dark)]">
                    {result.whatWentWell.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span className="mt-1 text-[var(--wc-sage-dark)]">●</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="wc-card wc-status-warning print-break-avoid p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-2xl bg-[var(--wc-paper)]/85 p-2 text-[var(--wc-gold-dark)]">
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-[var(--wc-gold-dark)]">What could be better</h3>
                      <p className="text-sm text-[var(--wc-brown-dark)]">
                        Missed supports or patterns that may have increased stress.
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-3 text-sm leading-6 text-[var(--wc-brown-dark)]">
                    {result.whatCouldBeBetter.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span className="mt-1 text-[var(--wc-gold-dark)]">●</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              <section className="wc-card overflow-hidden">
                <div className="border-b px-6 py-5 wc-wash-blue">
                  <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--wc-brown)]">
                        Guidance from the documents
                      </p>
                      <h3 className="mt-2 text-2xl font-semibold text-[var(--wc-brown-darker)]">
                        IEP strategies that should have shaped the response
                      </h3>
                    </div>
                    <p className="max-w-2xl text-sm leading-6 text-[var(--wc-brown-dark)]">
                      These items keep the applicable support, the source, and the citation together so the team can reference them quickly.
                    </p>
                  </div>
                </div>

                <div className="space-y-4 p-6">
                  {result.iepGuidance.map((item) => (
                    <article
                      key={`${item.title}-${item.page ?? "na"}`}
                      className="print-break-avoid rounded-2xl border border-[var(--wc-blue)]/15 bg-[var(--wc-blue-pale)]/20 p-5"
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-lg font-semibold text-[var(--wc-brown-darker)]">{item.title}</h4>
                            <span
                              className={`rounded-full border px-3 py-1 text-xs font-semibold ${getGuidanceBadge(item)}`}
                            >
                              {item.source ?? "IEP"}
                            </span>
                          </div>
                          <p className="mt-3 text-sm leading-6 text-[var(--wc-brown-dark)]">{item.description}</p>
                        </div>
                        {item.page ? (
                          <span className="shrink-0 rounded-full border border-[var(--wc-brown-muted)]/40 bg-[var(--wc-paper)] px-3 py-1 text-xs text-[var(--wc-brown)]">
                            Page {item.page}
                          </span>
                        ) : null}
                      </div>
                      {item.quote ? (
                        <blockquote className="mt-4 rounded-2xl border-l-4 border-[var(--wc-blue)]/40 bg-[var(--wc-paper)]/80 p-4 text-sm italic leading-6 text-[var(--wc-brown)]">
                          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] not-italic text-[var(--wc-blue-dark)]">
                            Supporting quote
                          </div>
                          “{item.quote}”
                        </blockquote>
                      ) : null}
                    </article>
                  ))}
                </div>
              </section>

              <div className="grid gap-4 lg:grid-cols-[1.05fr_1.15fr]">
                <section className="wc-card print-break-avoid p-6 md:p-7">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-2xl bg-[var(--wc-blue-pale)] p-2 text-[var(--wc-blue-dark)]">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold text-[var(--wc-brown-darker)]">
                        Recommendations for future incidents
                      </h3>
                      <p className="text-sm text-[var(--wc-brown-dark)]">
                        Concrete next steps that can reduce escalation and improve alignment.
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-4">
                    {result.futureRecommendations.map((item, index) => (
                      <li key={item} className="flex gap-4">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--wc-blue-pale)] text-sm font-semibold text-[var(--wc-blue-dark)]">
                          {index + 1}
                        </div>
                        <p className="pt-1 text-sm leading-6 text-[var(--wc-brown-dark)]">{item}</p>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="wc-card print-break-avoid relative overflow-hidden p-6 md:p-7">
                  <div className="print-decor absolute inset-0 wc-wash-sage opacity-45" aria-hidden="true" />
                  <div className="relative">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="rounded-2xl bg-[var(--wc-paper)]/85 p-2 text-[var(--wc-sage-dark)]">
                        <Brain className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold text-[var(--wc-brown-darker)]">PDA considerations</h3>
                        <p className="text-sm text-[var(--wc-brown-dark)]">
                          Nervous-system-aware ideas that can support safer follow-through.
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {result.pdaConsiderations.map((item) => (
                        <article
                          key={item.strategy}
                          className="print-break-avoid rounded-2xl border border-[var(--wc-sage)]/20 bg-[var(--wc-paper)]/85 p-4"
                        >
                          <h4 className="text-lg font-semibold text-[var(--wc-sage-dark)]">{item.strategy}</h4>
                          <p className="mt-2 text-sm leading-6 text-[var(--wc-brown-dark)]">{item.explanation}</p>
                          <div className="mt-3 rounded-2xl bg-[var(--wc-sage-pale)]/60 p-3">
                            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--wc-sage-dark)]">
                              How to implement
                            </div>
                            <p className="mt-2 text-sm leading-6 text-[var(--wc-brown-dark)]">
                              {item.howToImplement}
                            </p>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                </section>
              </div>

              <DonationPrompt />
            </div>
          ) : (
            <>
              <div className="wc-card p-6 space-y-6 print:hidden">
                <DualUploadZone
                  onFilesSelect={(behaviorReport, iepDocument) =>
                    void submitBehaviorRequest(behaviorReport, iepDocument)
                  }
                  isProcessing={isProcessing}
                />

                {error ? (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                  </div>
                ) : null}

                {warningReason ? (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-700 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-amber-900">Documents may be irrelevant</h3>
                        <p className="text-sm text-amber-800 mt-1">{warningReason}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline-organic"
                        onClick={() => {
                          setPendingSubmission(null);
                          setWarningReason(null);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button variant="watercolor" onClick={() => void proceedWithWarning()}>
                        Proceed Anyway
                      </Button>
                    </div>
                  </div>
                ) : null}

                <div className="rounded-2xl border border-[var(--wc-sage)]/15 bg-[var(--wc-sage-pale)]/35 p-4">
                  <div className="max-w-2xl">
                    <div className="flex items-center gap-2 font-medium text-[var(--wc-sage-dark)]">
                      <Sparkles className="h-4 w-4" />
                      What you’ll receive
                    </div>
                    <ul className="mt-3 space-y-2 text-sm text-[var(--wc-brown-dark)]">
                      <li>Strengths and missed supports side by side</li>
                      <li>IEP guidance with source and page context</li>
                      <li>Future recommendations and PDA-aware implementation ideas</li>
                    </ul>
                  </div>
                </div>
              </div>

              {savedHistory.length > 0 ? (
                <div className="wc-card overflow-hidden print:hidden">
                  <div className="flex flex-col gap-3 border-b bg-[var(--wc-sage-pale)]/30 p-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-1">
                      <h2 className="font-semibold text-[var(--wc-brown-darker)]">Saved report history</h2>
                      <p className="text-xs text-[var(--wc-brown)]">
                        Reports are saved in this browser on this device until you delete them.
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs text-[var(--wc-brown)]">
                        {savedHistory.length} item{savedHistory.length === 1 ? "" : "s"}
                      </span>
                      <Button
                        variant="outline-organic"
                        size="sm"
                        onClick={() => {
                          clearBehaviorHistory();
                          setSavedHistory([]);
                        }}
                      >
                        Clear all history
                      </Button>
                    </div>
                  </div>
                  <div className="divide-y divide-[var(--wc-ochre-pale)]">
                    {savedHistory.map((entry) => (
                      <div key={entry.id} className="flex items-start justify-between gap-4 p-4">
                        <button
                          className="flex-1 cursor-pointer text-left disabled:cursor-not-allowed"
                          onClick={() => restoreHistory(entry)}
                          disabled={!entry.fullReport}
                        >
                          <div className="font-medium text-[var(--wc-brown-darker)]">
                            {entry.behaviorFileName} + {entry.iepFileName}
                          </div>
                          <div className="mt-1 text-sm text-[var(--wc-brown-dark)]">
                            {entry.summary}
                          </div>
                          <div className="mt-2 flex items-center gap-3 text-xs text-[var(--wc-brown)]">
                            <span className="inline-flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(entry.timestamp).toLocaleString()}
                            </span>
                            <span>Full report saved</span>
                          </div>
                        </button>
                        <Button variant="ghost-warm" size="icon" onClick={() => removeHistoryEntry(entry.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </>
          )}

          <PrivacyNotice />
          <Disclaimer />
        </div>
      </main>

      <HumanVerificationPanel
        open={verificationOpen}
        purpose="behavior-report"
        verificationMode={humanVerificationMode}
        turnstileSiteKey={turnstileSiteKey}
        onClose={() => setVerificationOpen(false)}
        onVerified={() => void continueAfterVerification()}
      />
      <Footer />
    </div>
  );
}

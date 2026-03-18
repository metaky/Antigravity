"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  Printer,
  Sparkles,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { UploadZone } from "@/components/upload-zone";
import { PrivacyNotice, Disclaimer } from "@/components/privacy-notice";
import { DonationPrompt } from "@/components/donation-prompt";
import { FeatureUnavailable } from "@/components/feature-unavailable";
import { HumanVerificationPanel } from "@/components/human-verification-panel";
import { Button } from "@/components/ui/button";
import type {
  AnalyzeFindingCategory,
  AnalyzeReport,
  ApiResponse,
  StoredAnalyzeHistoryEntry,
} from "@/lib/server/api-types";
import analytics from "@/services/analytics";
import {
  clearAnalyzeHistory,
  loadAnalyzeHistory,
  removeAnalyzeHistoryEntry,
  saveAnalyzeHistory,
} from "@/lib/client/history";
import { getSecurityHeaders } from "@/lib/client/security";

type PendingAnalyzeSubmission = {
  file: File;
  warningId?: string;
};

type AnalyzePageClientProps = {
  featureEnabled: boolean;
  maintenanceMode: boolean;
  historyLimit: number;
};

const categoryStyles: Record<
  AnalyzeFindingCategory,
  {
    wash: string;
    badgeClassName: string;
    borderClassName: string;
  }
> = {
  Goal: {
    wash: "wc-wash-blue",
    badgeClassName:
      "bg-[var(--wc-blue-pale)] text-[var(--wc-blue-dark)] border-[var(--wc-blue)]/20",
    borderClassName: "border-[var(--wc-blue)]/20",
  },
  Accommodation: {
    wash: "wc-wash-sage",
    badgeClassName:
      "bg-[var(--wc-sage-pale)] text-[var(--wc-sage-dark)] border-[var(--wc-sage)]/20",
    borderClassName: "border-[var(--wc-sage)]/20",
  },
  Service: {
    wash: "wc-wash-ochre",
    badgeClassName:
      "bg-[var(--wc-ochre-pale)] text-[var(--wc-ochre-dark)] border-[var(--wc-ochre)]/20",
    borderClassName: "border-[var(--wc-ochre)]/20",
  },
  "Behavior Plan": {
    wash: "wc-wash-gold",
    badgeClassName:
      "bg-[var(--wc-gold-pale)] text-[var(--wc-gold-dark)] border-[var(--wc-gold)]/20",
    borderClassName: "border-[var(--wc-gold)]/20",
  },
  General: {
    wash: "wc-wash-blue",
    badgeClassName:
      "bg-[var(--wc-blue-pale)] text-[var(--wc-blue-dark)] border-[var(--wc-blue)]/20",
    borderClassName: "border-[var(--wc-blue)]/20",
  },
};

function getScoreTone(score: number) {
  if (score >= 85) {
    return {
      label: "Strong foundation",
      description: "This plan already includes several supportive, regulation-aware elements.",
      accentClassName:
        "bg-[var(--wc-sage-pale)] text-[var(--wc-sage-dark)] border-[var(--wc-sage)]/25",
      ringClassName: "ring-[var(--wc-sage)]/20",
      washClassName: "wc-wash-sage",
    };
  }

  if (score >= 70) {
    return {
      label: "Promising with revisions",
      description: "The plan shows support, but targeted changes could make daily implementation gentler.",
      accentClassName:
        "bg-[var(--wc-gold-pale)] text-[var(--wc-gold-dark)] border-[var(--wc-gold)]/25",
      ringClassName: "ring-[var(--wc-gold)]/20",
      washClassName: "wc-wash-gold",
    };
  }

  return {
    label: "Needs focused support",
    description: "This plan may create extra strain without clearer autonomy-supportive language and supports.",
    accentClassName:
      "bg-[rgba(196,122,110,0.15)] text-[var(--wc-error-dark)] border-[var(--wc-error)]/25",
    ringClassName: "ring-[var(--wc-error)]/20",
    washClassName: "wc-wash-ochre",
  };
}

export function AnalyzePageClient({
  featureEnabled,
  maintenanceMode,
  historyLimit,
}: AnalyzePageClientProps) {
  const printedAt = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date());
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<AnalyzeReport | null>(null);
  const [currentFileName, setCurrentFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [warningReason, setWarningReason] = useState<string | null>(null);
  const [pendingSubmission, setPendingSubmission] =
    useState<PendingAnalyzeSubmission | null>(null);
  const [verificationOpen, setVerificationOpen] = useState(false);
  const [savedHistory, setSavedHistory] = useState<StoredAnalyzeHistoryEntry[]>([]);

  useEffect(() => {
    setSavedHistory(loadAnalyzeHistory());
  }, []);

  const groupedResults = useMemo(() => {
    if (!result) {
      return [];
    }

    return Object.entries(
      result.results.reduce<Record<string, AnalyzeReport["results"]>>((acc, item) => {
        const key = item.category ?? "General";
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(item);
        return acc;
      }, {}),
    );
  }, [result]);

  const scoreTone = result ? getScoreTone(result.score) : null;

  function persistHistory(report: AnalyzeReport, fileName: string) {
    const next = saveAnalyzeHistory(
      {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        fileName,
        summary: report.summary,
        score: report.score,
        fullReport: report,
      },
      historyLimit,
    );
    setSavedHistory(next);
  }

  function restoreHistory(entry: StoredAnalyzeHistoryEntry) {
    if (!entry.fullReport) {
      setError("Only summary metadata was saved for that report.");
      return;
    }

    setCurrentFileName(entry.fileName);
    setResult(entry.fullReport);
    setError(null);
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "auto" });
    });
  }

  function removeHistoryEntry(entryId: string) {
    const remaining = removeAnalyzeHistoryEntry(entryId);
    setSavedHistory(remaining);
  }

  async function submitAnalyzeRequest(file: File, warningId?: string) {
    setIsProcessing(true);
    setError(null);
    setWarningReason(null);
    setCurrentFileName(file.name);

    try {
      const formData = new FormData();
      formData.append("file", file);
      if (warningId) {
        formData.append("warningId", warningId);
      }

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: getSecurityHeaders(),
        body: formData,
      });

      const data = (await response.json()) as ApiResponse<AnalyzeReport>;
      if (data.ok) {
        setResult(data.data);
        analytics.trackEvent("generated_report");
        persistHistory(data.data, file.name);
        return;
      }

      if (
        data.code === "VERIFICATION_REQUIRED" ||
        data.code === "SESSION_EXPIRED" ||
        data.code === "SESSION_MISMATCH"
      ) {
        setPendingSubmission({ file, warningId });
        setVerificationOpen(true);
        return;
      }

      if (data.type === "warning") {
        setPendingSubmission({ file, warningId: data.warningId });
        setWarningReason(data.message);
        return;
      }

      setError(data.message);
    } catch {
      setError("An unexpected error occurred while analyzing the document.");
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleFileSelect(file: File) {
    await submitAnalyzeRequest(file);
  }

  async function proceedWithWarning() {
    if (!pendingSubmission?.warningId) {
      return;
    }
    await submitAnalyzeRequest(pendingSubmission.file, pendingSubmission.warningId);
  }

  async function continueAfterVerification() {
    setVerificationOpen(false);
    if (!pendingSubmission) {
      return;
    }
    const nextSubmission = pendingSubmission;
    setPendingSubmission(null);
    await submitAnalyzeRequest(nextSubmission.file, nextSubmission.warningId);
  }

  const featureUnavailable = maintenanceMode || !featureEnabled;

  return (
    <div className="min-h-screen flex flex-col bg-muted/10">
      <Navbar />
      <main className="flex-1 container mx-auto pt-40 pb-12 px-4 md:px-6 print:max-w-none print:px-0 print:pt-0 print:pb-0">
        <div className="max-w-5xl mx-auto space-y-8 print:mx-0 print:max-w-none print:space-y-4">
          <div className="text-center space-y-4 print:hidden">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Upload your IEP or 504 Plan
            </h1>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Securely review goals, accommodations, and services against our{" "}
              <Link href="/pda-guide" className="text-indigo-600 hover:underline">
                PDA-affirming guide
              </Link>
              .
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
                <h1 className="print-report-title">IEP / 504 Analysis Report</h1>
                <p className="print-report-summary">{result.summary}</p>
                <div className="print-report-meta">
                  <div className="print-report-meta-item">
                    <span className="print-report-meta-label">Document</span>
                    <span className="print-report-meta-value">
                      {currentFileName ?? "Uploaded file"}
                    </span>
                  </div>
                  <div className="print-report-meta-item">
                    <span className="print-report-meta-label">PDA affirming score</span>
                    <span className="print-report-meta-value">{result.score} / 100</span>
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
                  className="print-decor absolute -top-12 right-0 h-36 w-36 rounded-full bg-[var(--wc-blue)]/10 blur-3xl"
                  aria-hidden="true"
                />
                <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <div className="max-w-3xl space-y-3">
                    <div className="inline-flex items-center gap-2 rounded-full border border-[var(--wc-blue)]/20 bg-[var(--wc-blue-pale)]/75 px-3 py-1 text-sm font-semibold text-[var(--wc-blue-dark)]">
                      <Sparkles className="h-4 w-4" />
                      Analysis Results
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold tracking-tight text-[var(--wc-brown-darker)]">
                        Your report is organized for quick decision-making
                      </h2>
                      <p className="mt-2 text-base leading-7 text-[var(--wc-brown-dark)]">
                        {currentFileName ? `Report for ${currentFileName}` : "Review your report below."}
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
                        setCurrentFileName(null);
                        setWarningReason(null);
                        setError(null);
                      }}
                    >
                      Analyze Another File
                    </Button>
                  </div>
                </div>
              </section>

              <div className="grid gap-4 lg:grid-cols-[1.1fr_1.9fr] print:grid-cols-1">
                <section
                  className={`wc-card print-break-avoid relative overflow-hidden p-6 md:p-7 ring-1 print:hidden ${scoreTone?.ringClassName ?? ""}`}
                >
                  <div
                    className={`print-decor absolute inset-0 opacity-80 ${scoreTone?.washClassName ?? ""}`}
                    aria-hidden="true"
                  />
                  <div className="relative space-y-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--wc-brown)]">
                          PDA Affirming Score
                        </p>
                        <p className="mt-2 text-sm text-[var(--wc-brown-dark)]">
                          A quick snapshot of how well this plan supports regulation and autonomy.
                        </p>
                      </div>
                      <div className="min-w-[9rem] rounded-[2rem] border border-[var(--wc-paper)]/80 bg-[var(--wc-paper)]/90 px-5 py-4 text-center shadow-sm backdrop-blur">
                        <div className="text-6xl font-bold leading-none tracking-tight text-[var(--wc-brown-darker)] md:text-7xl">
                          {result.score}
                        </div>
                        <div className="mt-3 text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-[var(--wc-brown)]">
                          Score
                        </div>
                        <div className="mt-1 text-sm text-[var(--wc-brown)]/80">
                          out of 100
                        </div>
                      </div>
                    </div>
                    <div
                      className={`inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${scoreTone?.accentClassName ?? ""}`}
                    >
                      {scoreTone?.label}
                    </div>
                    <p className="text-sm leading-6 text-[var(--wc-brown-dark)]">
                      {scoreTone?.description}
                    </p>
                  </div>
                </section>

                <section className="wc-card print-break-avoid p-6 md:p-7">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 rounded-2xl bg-[var(--wc-ochre-pale)] p-3 text-[var(--wc-ochre-dark)]">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--wc-brown)]">
                          Plain-language summary
                        </p>
                        <h3 className="mt-2 text-2xl font-semibold text-[var(--wc-brown-darker)]">
                          What stands out most in this plan
                        </h3>
                      </div>
                      <p className="max-w-3xl text-base leading-7 text-[var(--wc-brown-dark)]">
                        {result.summary}
                      </p>
                    </div>
                  </div>
                </section>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <section className="wc-card wc-status-good print-break-avoid p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-2xl bg-[var(--wc-paper)]/85 p-2 text-[var(--wc-sage-dark)]">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-[var(--wc-sage-dark)]">Strengths to preserve</h3>
                      <p className="text-sm text-[var(--wc-brown-dark)]">
                        Effective supports already present in the document.
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-3 text-sm leading-6 text-[var(--wc-brown-dark)]">
                    {result.strengths.map((item) => (
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
                      <TriangleAlert className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-[var(--wc-gold-dark)]">Opportunities to revise</h3>
                      <p className="text-sm text-[var(--wc-brown-dark)]">
                        Areas that may benefit from softer language or stronger supports.
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-3 text-sm leading-6 text-[var(--wc-brown-dark)]">
                    {result.opportunities.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span className="mt-1 text-[var(--wc-gold-dark)]">●</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              <section className="wc-card p-6 md:p-7">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--wc-brown)]">
                      Category guidance
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold text-[var(--wc-brown-darker)]">
                      Suggested adds and removals
                    </h3>
                  </div>
                  <p className="max-w-2xl text-sm leading-6 text-[var(--wc-brown-dark)]">
                    These suggestions group the findings into concrete document edits so it is easier to plan next steps.
                  </p>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {Object.entries(result.categorySuggestions).map(([category, suggestions]) => {
                    const style = categoryStyles[category as AnalyzeFindingCategory];

                    return (
                      <article
                        key={category}
                        className={`wc-card print-break-avoid relative overflow-hidden border ${style.borderClassName} p-5`}
                      >
                        <div
                          className={`print-decor absolute inset-0 opacity-65 ${style.wash}`}
                          aria-hidden="true"
                        />
                        <div className="relative space-y-4">
                          <div className="flex items-center justify-between gap-3">
                            <h4 className="text-lg font-semibold text-[var(--wc-brown-darker)]">{category}</h4>
                            <span
                              className={`rounded-full border px-3 py-1 text-xs font-semibold ${style.badgeClassName}`}
                            >
                              Focus area
                            </span>
                          </div>

                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="rounded-2xl bg-[var(--wc-paper)]/80 p-4">
                              <div className="text-sm font-semibold text-[var(--wc-sage-dark)]">Consider adding</div>
                              <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--wc-brown-dark)]">
                                {suggestions.add.length > 0 ? (
                                  suggestions.add.map((item) => (
                                    <li key={item} className="flex gap-2">
                                      <span className="mt-1 text-[var(--wc-sage-dark)]">+</span>
                                      <span>{item}</span>
                                    </li>
                                  ))
                                ) : (
                                  <li className="text-[var(--wc-brown)]">No specific additions suggested.</li>
                                )}
                              </ul>
                            </div>

                            <div className="rounded-2xl bg-[var(--wc-paper)]/80 p-4">
                              <div className="text-sm font-semibold text-[var(--wc-error-dark)]">Consider removing</div>
                              <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--wc-brown-dark)]">
                                {suggestions.remove.length > 0 ? (
                                  suggestions.remove.map((item) => (
                                    <li key={item} className="flex gap-2">
                                      <span className="mt-1 text-[var(--wc-error-dark)]">-</span>
                                      <span>{item}</span>
                                    </li>
                                  ))
                                ) : (
                                  <li className="text-[var(--wc-brown)]">No removals called out for this section.</li>
                                )}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--wc-brown)]">
                      Detailed findings
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold text-[var(--wc-brown-darker)]">
                      Finding-by-finding analysis with evidence
                    </h3>
                  </div>
                  <p className="max-w-2xl text-sm leading-6 text-[var(--wc-brown-dark)]">
                    Each section below groups related findings and keeps the recommendation next to the supporting quote.
                  </p>
                </div>

                {groupedResults.map(([category, items]) => (
                  <section key={category} className="wc-card overflow-hidden">
                    <div className={`border-b px-6 py-5 ${categoryStyles[category as AnalyzeFindingCategory].wash}`}>
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                          <h3 className="text-2xl font-semibold text-[var(--wc-brown-darker)]">{category}</h3>
                          <p className="mt-1 text-sm text-[var(--wc-brown-dark)]">
                            {items.length} finding{items.length === 1 ? "" : "s"} in this section
                          </p>
                        </div>
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${categoryStyles[category as AnalyzeFindingCategory].badgeClassName}`}
                        >
                          Organized by category
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4 p-6">
                      {items.map((item) => (
                        <article
                          key={`${item.title}-${item.page ?? "na"}`}
                          className={`print-break-avoid rounded-2xl border p-5 ${
                            item.status === "Good"
                              ? "border-[var(--wc-sage)]/20 bg-[var(--wc-sage-pale)]/35"
                              : "border-[var(--wc-gold)]/20 bg-[var(--wc-gold-pale)]/35"
                          }`}
                        >
                          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <h4 className="text-lg font-semibold text-[var(--wc-brown-darker)]">{item.title}</h4>
                                <span
                                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                                    item.status === "Good"
                                      ? "border-[var(--wc-sage)]/25 bg-[var(--wc-sage-pale)] text-[var(--wc-sage-dark)]"
                                      : "border-[var(--wc-gold)]/25 bg-[var(--wc-gold-pale)] text-[var(--wc-gold-dark)]"
                                  }`}
                                >
                                  {item.status}
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

                          <div className="mt-4 grid gap-4 lg:grid-cols-[1.25fr_0.95fr]">
                            <div className="rounded-2xl bg-[var(--wc-paper)]/80 p-4">
                              <div className="text-sm font-semibold text-[var(--wc-brown-darker)]">Recommendation</div>
                              <p className="mt-2 text-sm leading-6 text-[var(--wc-brown-dark)]">
                                {item.recommendation}
                              </p>
                            </div>

                            <blockquote className="rounded-2xl border-l-4 border-[var(--wc-blue)]/40 bg-[var(--wc-paper)]/80 p-4 text-sm italic leading-6 text-[var(--wc-brown)]">
                              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] not-italic text-[var(--wc-blue-dark)]">
                                Supporting text
                              </div>
                              “{item.quote}”
                            </blockquote>
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                ))}
              </section>

              <DonationPrompt />
            </div>
          ) : (
            <>
              <div className="wc-card p-6 space-y-6 print:hidden">
                <UploadZone onFileSelect={handleFileSelect} isProcessing={isProcessing} />

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
                        <h3 className="font-semibold text-amber-900">Document may be irrelevant</h3>
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

                <div className="rounded-2xl border border-[var(--wc-blue)]/15 bg-[var(--wc-blue-pale)]/35 p-4">
                  <div className="max-w-2xl">
                    <div className="flex items-center gap-2 font-medium text-[var(--wc-blue-dark)]">
                      <Sparkles className="h-4 w-4" />
                      What you’ll receive
                    </div>
                    <ul className="mt-3 space-y-2 text-sm text-[var(--wc-brown-dark)]">
                      <li>PDA affirming score</li>
                      <li>Strengths and opportunities</li>
                      <li>Category-based adds and removals</li>
                      <li>Finding-by-finding analysis with citations</li>
                    </ul>
                  </div>
                </div>
              </div>

              {savedHistory.length > 0 ? (
                <div className="wc-card overflow-hidden print:hidden">
                  <div className="flex flex-col gap-3 border-b bg-[var(--wc-blue-pale)]/30 p-4 md:flex-row md:items-center md:justify-between">
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
                          clearAnalyzeHistory();
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
                          <div className="font-medium text-[var(--wc-brown-darker)]">{entry.fileName}</div>
                          <div className="mt-1 text-sm text-[var(--wc-brown-dark)]">{entry.summary}</div>
                          <div className="mt-2 flex items-center gap-3 text-xs text-[var(--wc-brown)]">
                            <span className="inline-flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(entry.timestamp).toLocaleString()}
                            </span>
                            <span>Score {entry.score}</span>
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
        purpose="analyze"
        onClose={() => setVerificationOpen(false)}
        onVerified={() => void continueAfterVerification()}
      />
      <Footer />
    </div>
  );
}

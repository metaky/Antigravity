"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AlertCircle, Clock, Sparkles, Trash2 } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { UploadZone } from "@/components/upload-zone";
import { PrivacyNotice, Disclaimer } from "@/components/privacy-notice";
import { DonationPrompt } from "@/components/donation-prompt";
import { FeatureUnavailable } from "@/components/feature-unavailable";
import { HumanVerificationPanel } from "@/components/human-verification-panel";
import { Button } from "@/components/ui/button";
import type {
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

export function AnalyzePageClient({
  featureEnabled,
  maintenanceMode,
  historyLimit,
}: AnalyzePageClientProps) {
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
  }

  function removeHistoryEntry(entryId: string) {
    const remaining = removeAnalyzeHistoryEntry(entryId);
    setSavedHistory(remaining);
  }

  async function submitAnalyzeRequest(
    file: File,
    warningId?: string,
  ) {
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
      <main className="flex-1 container mx-auto pt-40 pb-12 px-4 md:px-6">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-4">
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
            <div className="space-y-6">
              <div className="bg-white rounded-xl border p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold">Analysis Results</h2>
                  <p className="text-muted-foreground">
                    {currentFileName ? `Report for ${currentFileName}` : "Review your report below."}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" onClick={() => window.print()}>
                    Print / Save PDF
                  </Button>
                  <Button
                    variant="premium"
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

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border p-6 text-center">
                  <div className="text-sm uppercase tracking-wide text-muted-foreground">
                    PDA Affirming Score
                  </div>
                  <div className="text-5xl font-bold mt-3">{result.score}</div>
                </div>
                <div className="bg-white rounded-xl border p-6 md:col-span-2">
                  <div className="text-sm uppercase tracking-wide text-muted-foreground">
                    Summary
                  </div>
                  <p className="mt-3 text-slate-700">{result.summary}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-xl border border-green-200 p-6">
                  <h3 className="font-semibold text-green-900 mb-3">Strengths</h3>
                  <ul className="space-y-2 text-sm text-green-900">
                    {result.strengths.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-amber-50 rounded-xl border border-amber-200 p-6">
                  <h3 className="font-semibold text-amber-900 mb-3">Opportunities</h3>
                  <ul className="space-y-2 text-sm text-amber-900">
                    {result.opportunities.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                {groupedResults.map(([category, items]) => (
                  <div key={category} className="bg-white rounded-xl border p-6">
                    <h3 className="text-xl font-semibold mb-4">{category}</h3>
                    <div className="space-y-4">
                      {items.map((item) => (
                        <div key={`${item.title}-${item.page ?? "na"}`} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <h4 className="font-semibold">{item.title}</h4>
                              <p className="text-sm text-muted-foreground">{item.status}</p>
                            </div>
                            {item.page ? (
                              <span className="text-xs text-muted-foreground">Page {item.page}</span>
                            ) : null}
                          </div>
                          <p className="mt-3 text-sm text-slate-700">{item.description}</p>
                          <p className="mt-3 text-sm font-medium text-slate-900">
                            Recommendation: {item.recommendation}
                          </p>
                          <blockquote className="mt-3 border-l-2 border-slate-200 pl-3 text-sm italic text-slate-600">
                            “{item.quote}”
                          </blockquote>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <DonationPrompt />
            </div>
          ) : (
            <>
              <div className="bg-white rounded-xl border p-6 space-y-6">
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
                        variant="outline"
                        onClick={() => {
                          setPendingSubmission(null);
                          setWarningReason(null);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button onClick={() => void proceedWithWarning()}>
                        Proceed Anyway
                      </Button>
                    </div>
                  </div>
                ) : null}

                <div className="rounded-xl border bg-slate-50 p-4">
                  <div className="max-w-2xl">
                    <div className="flex items-center gap-2 font-medium">
                      <Sparkles className="h-4 w-4 text-indigo-600" />
                      What you’ll receive
                    </div>
                    <ul className="mt-3 space-y-2 text-sm text-slate-700">
                      <li>PDA affirming score</li>
                      <li>Strengths and opportunities</li>
                      <li>Finding-by-finding analysis with citations</li>
                    </ul>
                  </div>
                </div>
              </div>

              {savedHistory.length > 0 ? (
                <div className="bg-white rounded-xl border overflow-hidden">
                  <div className="p-4 border-b bg-slate-50 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-1">
                      <h2 className="font-semibold">Saved device history</h2>
                      <p className="text-xs text-muted-foreground">
                        Reports are saved in this browser on this device until you delete them.
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs text-muted-foreground">
                        {savedHistory.length} item{savedHistory.length === 1 ? "" : "s"}
                      </span>
                      <Button
                        variant="outline"
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
                  <div className="divide-y">
                    {savedHistory.map((entry) => (
                      <div key={entry.id} className="p-4 flex items-start justify-between gap-4">
                        <button
                          className="text-left flex-1"
                          onClick={() => restoreHistory(entry)}
                          disabled={!entry.fullReport}
                        >
                          <div className="font-medium">{entry.fileName}</div>
                          <div className="mt-1 text-sm text-muted-foreground">
                            {entry.summary}
                          </div>
                          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="inline-flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(entry.timestamp).toLocaleString()}
                            </span>
                            <span>Score {entry.score}</span>
                            <span>Full report saved</span>
                          </div>
                        </button>
                        <Button variant="ghost" size="icon" onClick={() => removeHistoryEntry(entry.id)}>
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

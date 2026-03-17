"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  BookOpen,
  Brain,
  CheckCircle,
  Clock,
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
  StoredBehaviorHistoryEntry,
} from "@/lib/server/api-types";
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
};

export function BehaviorReportPageClient({
  featureEnabled,
  maintenanceMode,
  historyLimit,
}: BehaviorReportPageClientProps) {
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

  function persistHistory(report: BehaviorReportAnalysis, behaviorFileName: string, iepFileName: string) {
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
        persistHistory(
          data.data,
          behaviorReport.name,
          iepDocument.name,
        );
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
      <main className="flex-1 container mx-auto pt-40 pb-12 px-4 md:px-6">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-4">
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
            <div className="space-y-6">
              <div className="bg-white rounded-xl border p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold">Behavior Incident Analysis</h2>
                  <p className="text-muted-foreground">
                    {fileNames
                      ? `${fileNames.behavior} compared with ${fileNames.iep}`
                      : "Review your report below."}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" onClick={() => window.print()}>
                    Print / Save PDF
                  </Button>
                  <Button variant="premium" onClick={() => setResult(null)}>
                    Analyze Another Incident
                  </Button>
                </div>
              </div>

              <div className="bg-white rounded-xl border p-6">
                <h3 className="font-semibold text-lg">Executive Summary</h3>
                <p className="mt-3 text-slate-700">{result.summary}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-xl border border-green-200 p-6">
                  <h3 className="flex items-center gap-2 font-semibold text-green-900 mb-3">
                    <CheckCircle className="h-5 w-5" />
                    What went well
                  </h3>
                  <ul className="space-y-2 text-sm text-green-900">
                    {result.whatWentWell.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-amber-50 rounded-xl border border-amber-200 p-6">
                  <h3 className="flex items-center gap-2 font-semibold text-amber-900 mb-3">
                    <AlertTriangle className="h-5 w-5" />
                    What could be better
                  </h3>
                  <ul className="space-y-2 text-sm text-amber-900">
                    {result.whatCouldBeBetter.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-white rounded-xl border p-6">
                <h3 className="flex items-center gap-2 font-semibold text-lg mb-4">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  IEP strategies that should have been applied
                </h3>
                <div className="space-y-4">
                  {result.iepGuidance.map((item) => (
                    <div key={`${item.title}-${item.page ?? "na"}`} className="border rounded-lg p-4">
                      <h4 className="font-semibold">{item.title}</h4>
                      <p className="mt-2 text-sm text-slate-700">{item.description}</p>
                      {item.quote ? (
                        <blockquote className="mt-3 border-l-2 border-slate-200 pl-3 text-sm italic text-slate-600">
                          “{item.quote}”{item.page ? ` (Page ${item.page})` : ""}
                        </blockquote>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl border p-6">
                <h3 className="flex items-center gap-2 font-semibold text-lg mb-4">
                  <Sparkles className="h-5 w-5 text-indigo-600" />
                  Recommendations for future incidents
                </h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  {result.futureRecommendations.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-purple-50 rounded-xl border border-purple-200 p-6">
                <h3 className="flex items-center gap-2 font-semibold text-lg mb-4 text-purple-900">
                  <Brain className="h-5 w-5 text-purple-600" />
                  PDA considerations
                </h3>
                <div className="space-y-4">
                  {result.pdaConsiderations.map((item) => (
                    <div key={item.strategy} className="bg-white rounded-lg border border-purple-100 p-4">
                      <h4 className="font-semibold text-purple-900">{item.strategy}</h4>
                      <p className="mt-2 text-sm text-slate-700">{item.explanation}</p>
                      <p className="mt-2 text-sm text-purple-900">
                        How to implement: {item.howToImplement}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <DonationPrompt />
            </div>
          ) : (
            <>
              <div className="bg-white rounded-xl border p-6 space-y-6">
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
                          clearBehaviorHistory();
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
                          <div className="font-medium">
                            {entry.behaviorFileName} + {entry.iepFileName}
                          </div>
                          <div className="mt-1 text-sm text-muted-foreground">
                            {entry.summary}
                          </div>
                          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="inline-flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(entry.timestamp).toLocaleString()}
                            </span>
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
        purpose="behavior-report"
        onClose={() => setVerificationOpen(false)}
        onVerified={() => void continueAfterVerification()}
      />
      <Footer />
    </div>
  );
}

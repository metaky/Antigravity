"use client";

import type {
  AnalyzeReport,
  BehaviorReportAnalysis,
  StoredAnalyzeHistoryEntry,
  StoredBehaviorHistoryEntry,
} from "@/lib/server/api-types";

const HISTORY_ENABLED_KEY = "device_history_enabled_v2";
const ANALYZE_HISTORY_KEY = "analyze_history_v2";
const BEHAVIOR_HISTORY_KEY = "behavior_history_v2";

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function trimEntries<T extends { timestamp: number }>(entries: T[], limit: number) {
  return [...entries]
    .sort((left, right) => right.timestamp - left.timestamp)
    .slice(0, limit);
}

export function getHistoryEnabled() {
  return readJson<boolean>(HISTORY_ENABLED_KEY, false);
}

export function setHistoryEnabled(enabled: boolean) {
  writeJson(HISTORY_ENABLED_KEY, enabled);
}

export function loadAnalyzeHistory() {
  return readJson<StoredAnalyzeHistoryEntry[]>(ANALYZE_HISTORY_KEY, []);
}

export function saveAnalyzeHistoryMetadata(
  entry: Omit<StoredAnalyzeHistoryEntry, "fullReport">,
  limit: number,
) {
  const existing = loadAnalyzeHistory().filter((item) => item.id !== entry.id);
  const next = trimEntries([entry, ...existing], limit);
  writeJson(ANALYZE_HISTORY_KEY, next);
  return next;
}

export function saveAnalyzeHistoryFullReport(
  id: string,
  report: AnalyzeReport,
  limit: number,
) {
  const existing = loadAnalyzeHistory();
  const next = trimEntries(
    existing.map((item) => (item.id === id ? { ...item, fullReport: report } : item)),
    limit,
  );
  writeJson(ANALYZE_HISTORY_KEY, next);
  return next;
}

export function clearAnalyzeHistory() {
  writeJson(ANALYZE_HISTORY_KEY, []);
}

export function loadBehaviorHistory() {
  return readJson<StoredBehaviorHistoryEntry[]>(BEHAVIOR_HISTORY_KEY, []);
}

export function saveBehaviorHistoryMetadata(
  entry: Omit<StoredBehaviorHistoryEntry, "fullReport">,
  limit: number,
) {
  const existing = loadBehaviorHistory().filter((item) => item.id !== entry.id);
  const next = trimEntries([entry, ...existing], limit);
  writeJson(BEHAVIOR_HISTORY_KEY, next);
  return next;
}

export function saveBehaviorHistoryFullReport(
  id: string,
  report: BehaviorReportAnalysis,
  limit: number,
) {
  const existing = loadBehaviorHistory();
  const next = trimEntries(
    existing.map((item) => (item.id === id ? { ...item, fullReport: report } : item)),
    limit,
  );
  writeJson(BEHAVIOR_HISTORY_KEY, next);
  return next;
}

export function clearBehaviorHistory() {
  writeJson(BEHAVIOR_HISTORY_KEY, []);
}

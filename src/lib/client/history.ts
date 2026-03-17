"use client";

import type {
  StoredAnalyzeHistoryEntry,
  StoredBehaviorHistoryEntry,
} from "@/lib/server/api-types";

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

export function loadAnalyzeHistory() {
  return readJson<StoredAnalyzeHistoryEntry[]>(ANALYZE_HISTORY_KEY, []);
}

export function saveAnalyzeHistory(
  entry: StoredAnalyzeHistoryEntry,
  limit: number,
) {
  const existing = loadAnalyzeHistory().filter((item) => item.id !== entry.id);
  const next = trimEntries([entry, ...existing], limit);
  writeJson(ANALYZE_HISTORY_KEY, next);
  return next;
}

export function removeAnalyzeHistoryEntry(id: string) {
  const next = loadAnalyzeHistory().filter((item) => item.id !== id);
  writeJson(ANALYZE_HISTORY_KEY, next);
  return next;
}

export function clearAnalyzeHistory() {
  writeJson(ANALYZE_HISTORY_KEY, []);
}

export function loadBehaviorHistory() {
  return readJson<StoredBehaviorHistoryEntry[]>(BEHAVIOR_HISTORY_KEY, []);
}

export function saveBehaviorHistory(
  entry: StoredBehaviorHistoryEntry,
  limit: number,
) {
  const existing = loadBehaviorHistory().filter((item) => item.id !== entry.id);
  const next = trimEntries([entry, ...existing], limit);
  writeJson(BEHAVIOR_HISTORY_KEY, next);
  return next;
}

export function removeBehaviorHistoryEntry(id: string) {
  const next = loadBehaviorHistory().filter((item) => item.id !== id);
  writeJson(BEHAVIOR_HISTORY_KEY, next);
  return next;
}

export function clearBehaviorHistory() {
  writeJson(BEHAVIOR_HISTORY_KEY, []);
}

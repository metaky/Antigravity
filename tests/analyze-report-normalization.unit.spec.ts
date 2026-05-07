import { expect, test } from "@playwright/test";
import {
  normalizeAnalyzeFindingCategory,
  normalizeAnalyzeFindingStatus,
  normalizeAnalyzeScore,
} from "@/lib/analyze-report-normalization";

test.describe("analyze report normalization", () => {
  test("keeps known finding categories unchanged", () => {
    expect(normalizeAnalyzeFindingCategory("Goal")).toBe("Goal");
    expect(normalizeAnalyzeFindingCategory("Accommodation")).toBe("Accommodation");
    expect(normalizeAnalyzeFindingCategory("Service")).toBe("Service");
    expect(normalizeAnalyzeFindingCategory("Behavior Plan")).toBe("Behavior Plan");
    expect(normalizeAnalyzeFindingCategory("General")).toBe("General");
  });

  test("normalizes unexpected finding categories to General", () => {
    expect(normalizeAnalyzeFindingCategory("Compliance")).toBe("General");
  });

  test("normalizes unexpected finding statuses to Needs Review", () => {
    expect(normalizeAnalyzeFindingStatus("Mixed")).toBe("Needs Review");
  });

  test("clamps scores to the public 0 to 100 range", () => {
    expect(normalizeAnalyzeScore(-12)).toBe(0);
    expect(normalizeAnalyzeScore(42)).toBe(42);
    expect(normalizeAnalyzeScore(108)).toBe(100);
  });
});

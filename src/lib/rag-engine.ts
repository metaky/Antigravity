import fs from "fs";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type {
  AnalyzeReport,
  BehaviorReportAnalysis,
} from "@/lib/server/api-types";
import { PublicApiError } from "@/lib/server/errors";
import { getServerConfig } from "@/lib/server/config";
import {
  MOCK_ANALYZE_REPORT,
  MOCK_BEHAVIOR_REPORT,
} from "@/lib/server/mock-analysis";
import { extractPdfText } from "@/lib/server/uploads";

interface DocumentChunk {
  id: string;
  content: string;
  source: string;
}

type ValidationResult = {
  isRelevant: boolean;
  reason: string;
};

const cachedChunks: DocumentChunk[] = [];
let isInitialized = false;

function parseJsonObject(text: string) {
  let jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
  const firstBrace = jsonStr.indexOf("{");
  const lastBrace = jsonStr.lastIndexOf("}");

  if (firstBrace !== -1 && lastBrace !== -1) {
    jsonStr = jsonStr.slice(firstBrace, lastBrace + 1);
  }

  try {
    return JSON.parse(jsonStr) as unknown;
  } catch {
    const fixedJson = jsonStr.replace(/,\s*}/g, "}").replace(/,\s*]/g, "]");
    return JSON.parse(fixedJson) as unknown;
  }
}

function assertString(value: unknown, field: string) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new PublicApiError(
      `Model response is missing ${field}.`,
      503,
      "INVALID_MODEL_RESPONSE",
      true,
    );
  }
  return value.trim();
}

function assertStringArray(value: unknown, field: string) {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new PublicApiError(
      `Model response is missing ${field}.`,
      503,
      "INVALID_MODEL_RESPONSE",
      true,
    );
  }
  return value.map((item) => item.trim()).filter(Boolean);
}

function assertNumber(value: unknown, field: string) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new PublicApiError(
      `Model response is missing ${field}.`,
      503,
      "INVALID_MODEL_RESPONSE",
      true,
    );
  }
  return value;
}

function assertAnalyzeReport(value: unknown): AnalyzeReport {
  if (!value || typeof value !== "object") {
    throw new PublicApiError(
      "Model response is invalid.",
      503,
      "INVALID_MODEL_RESPONSE",
      true,
    );
  }

  const record = value as Record<string, unknown>;
  const categorySuggestions = record.categorySuggestions;
  if (!categorySuggestions || typeof categorySuggestions !== "object") {
    throw new PublicApiError(
      "Model response is missing category suggestions.",
      503,
      "INVALID_MODEL_RESPONSE",
      true,
    );
  }

  const castCategory = (
    name: "Goal" | "Accommodation" | "Service" | "Behavior Plan",
  ) => {
    const item = (categorySuggestions as Record<string, unknown>)[name];
    if (!item || typeof item !== "object") {
      throw new PublicApiError(
        `Model response is missing ${name} suggestions.`,
        503,
        "INVALID_MODEL_RESPONSE",
        true,
      );
    }
    const typed = item as Record<string, unknown>;
    return {
      add: assertStringArray(typed.add, `${name}.add`),
      remove: assertStringArray(typed.remove, `${name}.remove`),
    };
  };

  if (!Array.isArray(record.results)) {
    throw new PublicApiError(
      "Model response is missing results.",
      503,
      "INVALID_MODEL_RESPONSE",
      true,
    );
  }

  return {
    score: assertNumber(record.score, "score"),
    summary: assertString(record.summary, "summary"),
    strengths: assertStringArray(record.strengths, "strengths"),
    opportunities: assertStringArray(record.opportunities, "opportunities"),
    categorySuggestions: {
      Goal: castCategory("Goal"),
      Accommodation: castCategory("Accommodation"),
      Service: castCategory("Service"),
      "Behavior Plan": castCategory("Behavior Plan"),
    },
    results: record.results.map((item) => {
      if (!item || typeof item !== "object") {
        throw new PublicApiError(
          "Model response contains an invalid finding.",
          503,
          "INVALID_MODEL_RESPONSE",
          true,
        );
      }
      const finding = item as Record<string, unknown>;
      return {
        category: assertString(finding.category, "results.category") as AnalyzeReport["results"][number]["category"],
        title: assertString(finding.title, "results.title"),
        status: assertString(finding.status, "results.status") as AnalyzeReport["results"][number]["status"],
        description: assertString(finding.description, "results.description"),
        recommendation: assertString(
          finding.recommendation,
          "results.recommendation",
        ),
        quote: assertString(finding.quote, "results.quote"),
        page:
          typeof finding.page === "number" && Number.isFinite(finding.page)
            ? finding.page
            : null,
      };
    }),
  };
}

function assertBehaviorReportAnalysis(value: unknown): BehaviorReportAnalysis {
  if (!value || typeof value !== "object") {
    throw new PublicApiError(
      "Model response is invalid.",
      503,
      "INVALID_MODEL_RESPONSE",
      true,
    );
  }

  const record = value as Record<string, unknown>;
  const iepGuidance = Array.isArray(record.iepGuidance) ? record.iepGuidance : [];
  const pdaConsiderations = Array.isArray(record.pdaConsiderations)
    ? record.pdaConsiderations
    : [];

  return {
    summary: assertString(record.summary, "summary"),
    whatWentWell: assertStringArray(record.whatWentWell, "whatWentWell"),
    whatCouldBeBetter: assertStringArray(
      record.whatCouldBeBetter,
      "whatCouldBeBetter",
    ),
    iepGuidance: iepGuidance.map((item) => {
      if (!item || typeof item !== "object") {
        throw new PublicApiError(
          "Model response contains invalid guidance.",
          503,
          "INVALID_MODEL_RESPONSE",
          true,
        );
      }
      const typed = item as Record<string, unknown>;
      return {
        title: assertString(typed.title, "iepGuidance.title"),
        description: assertString(typed.description, "iepGuidance.description"),
        quote: typeof typed.quote === "string" ? typed.quote : undefined,
        page:
          typeof typed.page === "number" && Number.isFinite(typed.page)
            ? typed.page
            : undefined,
        source:
          typed.source === "IEP" || typed.source === "BIR"
            ? typed.source
            : undefined,
      };
    }),
    futureRecommendations: assertStringArray(
      record.futureRecommendations,
      "futureRecommendations",
    ),
    pdaConsiderations: pdaConsiderations.map((item) => {
      if (!item || typeof item !== "object") {
        throw new PublicApiError(
          "Model response contains invalid PDA guidance.",
          503,
          "INVALID_MODEL_RESPONSE",
          true,
        );
      }
      const typed = item as Record<string, unknown>;
      return {
        strategy: assertString(typed.strategy, "pdaConsiderations.strategy"),
        explanation: assertString(
          typed.explanation,
          "pdaConsiderations.explanation",
        ),
        howToImplement: assertString(
          typed.howToImplement,
          "pdaConsiderations.howToImplement",
        ),
      };
    }),
  };
}

export class RagEngine {
  private chunks: DocumentChunk[] = [];

  async init() {
    if (isInitialized) {
      this.chunks = cachedChunks;
      return;
    }

    const docsDir = path.join(process.cwd(), "src/data/rag_docs");
    if (fs.existsSync(docsDir)) {
      const files = fs
        .readdirSync(docsDir)
        .filter((file) => file.endsWith(".txt") || file.endsWith(".rtf"));

      for (const file of files) {
        let content = await fs.promises.readFile(
          path.join(docsDir, file),
          "utf-8",
        );

        if (file.endsWith(".rtf")) {
          content = content
            .replace(/\\par/g, "\n")
            .replace(/\\tab/g, "\t")
            .replace(/[{}]/g, "")
            .replace(/\\[a-z0-9\-]+\s?/g, "")
            .replace(/\\\*/g, "")
            .replace(/;/g, "")
            .replace(/\\'.{2}/g, "");
        }

        const parts = content.split("\n").filter((line) => {
          const trimmed = line.trim();
          return trimmed.length > 20 && trimmed.includes(" ");
        });

        parts.forEach((part, index) => {
          cachedChunks.push({
            id: `${file}-${index}`,
            content: part.trim(),
            source: file,
          });
        });
      }
    }

    this.chunks = cachedChunks;
    isInitialized = true;
  }

  async retrieve(query: string, limit = 3): Promise<DocumentChunk[]> {
    await this.init();

    const keywords = query
      .toLowerCase()
      .split(" ")
      .filter((word) => word.length > 4);

    const scoredChunks = this.chunks.map((chunk) => {
      let score = 0;
      for (const keyword of keywords) {
        if (chunk.content.toLowerCase().includes(keyword)) {
          score += 1;
        }
      }

      if (chunk.content.toLowerCase().includes("measurable")) {
        score += 2;
      }

      return { chunk, score };
    });

    return scoredChunks
      .sort((left, right) => right.score - left.score)
      .filter((item) => item.score > 0)
      .slice(0, limit)
      .map((item) => item.chunk);
  }

  private getModel() {
    const config = getServerConfig();
    if (!config.models.geminiApiKey) {
      throw new PublicApiError(
        "Analysis is not configured.",
        503,
        "MODEL_UNAVAILABLE",
        true,
      );
    }

    const client = new GoogleGenerativeAI(config.models.geminiApiKey);
    return client.getGenerativeModel({
      model: config.models.geminiModel,
      generationConfig: {
        responseMimeType: "application/json",
      },
    });
  }

  async validateDocument(
    fileBuffer: Buffer,
    mimeType: string,
  ): Promise<ValidationResult> {
    const config = getServerConfig();
    if (config.mockMode) {
      const raw = extractPdfText(fileBuffer).toLowerCase();
      return {
        isRelevant:
          !raw.includes("receipt") &&
          !raw.includes("shopping list") &&
          !raw.includes("grocery"),
        reason: raw.includes("receipt")
          ? "This looks like a receipt rather than a school support document."
          : "Mock validation accepted the document.",
      };
    }

    const model = this.getModel();
    const prompt = `
You are a document classifier for a Special Education advocacy tool.
Determine whether the attached PDF is relevant to an IEP, 504 Plan, school behavior report, diagnosis summary, accommodation list, or related school support document.

Return strict JSON with:
{
  "isRelevant": boolean,
  "reason": "short explanation"
}
`;

    try {
      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: fileBuffer.toString("base64"),
            mimeType,
          },
        },
      ]);
      const parsed = parseJsonObject((await result.response).text()) as Record<
        string,
        unknown
      >;
      if (typeof parsed.isRelevant !== "boolean" || typeof parsed.reason !== "string") {
        throw new PublicApiError(
          "Validation response is invalid.",
          503,
          "INVALID_VALIDATION_RESPONSE",
          true,
        );
      }
      return {
        isRelevant: parsed.isRelevant,
        reason: parsed.reason,
      };
    } catch (error) {
      if (error instanceof PublicApiError) {
        throw error;
      }

      throw new PublicApiError(
        "Document validation is temporarily unavailable.",
        503,
        "VALIDATION_UNAVAILABLE",
        true,
      );
    }
  }

  async analyzeIEP(fileBuffer: Buffer, mimeType: string): Promise<AnalyzeReport> {
    const config = getServerConfig();
    if (config.mockMode) {
      return MOCK_ANALYZE_REPORT;
    }

    const context = await this.retrieve(
      "IEP goals accommodations and neuroaffirming compliance data",
      10,
    );
    const contextSummary = context
      .map((chunk) => `- ${chunk.content} (Source: ${chunk.source})`)
      .join("\n");

    const prompt = `
You are an expert special education advocate and IEP compliance reviewer specializing in PDA-affirming, neuroaffirming practices.
Review the attached PDF against the guidance below.

GUIDANCE:
${contextSummary}

Return strict JSON:
{
  "score": number,
  "summary": "2 sentence summary",
  "strengths": ["..."],
  "opportunities": ["..."],
  "categorySuggestions": {
    "Goal": { "add": ["..."], "remove": ["..."] },
    "Accommodation": { "add": ["..."], "remove": ["..."] },
    "Service": { "add": ["..."], "remove": ["..."] },
    "Behavior Plan": { "add": ["..."], "remove": ["..."] }
  },
  "results": [
    {
      "category": "Goal",
      "title": "Short title",
      "status": "Good",
      "description": "Analysis",
      "recommendation": "Specific recommendation",
      "quote": "Exact quote from PDF",
      "page": 1
    }
  ]
}
`;

    try {
      const result = await this.getModel().generateContent([
        prompt,
        {
          inlineData: {
            data: fileBuffer.toString("base64"),
            mimeType,
          },
        },
      ]);
      return assertAnalyzeReport(parseJsonObject((await result.response).text()));
    } catch (error) {
      if (error instanceof PublicApiError) {
        throw error;
      }

      throw new PublicApiError(
        "Document analysis is temporarily unavailable.",
        503,
        "ANALYSIS_UNAVAILABLE",
        true,
      );
    }
  }

  async analyzeBehaviorReport(
    behaviorBuffer: Buffer,
    iepBuffer: Buffer,
    mimeType: string,
  ): Promise<BehaviorReportAnalysis> {
    const config = getServerConfig();
    if (config.mockMode) {
      return MOCK_BEHAVIOR_REPORT;
    }

    const context = await this.retrieve(
      "PDA behavior incident de-escalation autonomy anxiety regulation",
      10,
    );
    const contextSummary = context
      .map((chunk) => `- ${chunk.content} (Source: ${chunk.source})`)
      .join("\n");

    const prompt = `
You are an expert advocate specializing in PDA-related school behavior incidents.
You are reviewing two PDFs: a behavior incident report and the student's IEP/504 document.

PDA GUIDANCE:
${contextSummary}

Return strict JSON:
{
  "summary": "2 sentence summary",
  "whatWentWell": ["..."],
  "whatCouldBeBetter": ["..."],
  "iepGuidance": [
    {
      "title": "Accommodation or strategy",
      "description": "How it should have been applied",
      "quote": "Exact quote",
      "page": 1,
      "source": "IEP"
    }
  ],
  "futureRecommendations": ["..."],
  "pdaConsiderations": [
    {
      "strategy": "Name",
      "explanation": "Why it helps PDA students",
      "howToImplement": "Concrete implementation steps"
    }
  ]
}
`;

    try {
      const result = await this.getModel().generateContent([
        prompt,
        {
          inlineData: {
            data: behaviorBuffer.toString("base64"),
            mimeType,
          },
        },
        {
          inlineData: {
            data: iepBuffer.toString("base64"),
            mimeType,
          },
        },
      ]);
      return assertBehaviorReportAnalysis(
        parseJsonObject((await result.response).text()),
      );
    } catch (error) {
      if (error instanceof PublicApiError) {
        throw error;
      }

      throw new PublicApiError(
        "Behavior report analysis is temporarily unavailable.",
        503,
        "ANALYSIS_UNAVAILABLE",
        true,
      );
    }
  }
}

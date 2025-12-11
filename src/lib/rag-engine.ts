import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from "@google/generative-ai";

interface DocumentChunk {
    id: string;
    content: string;
    source: string;
}

// Global cache to prevent re-parsing on every request
let cachedChunks: DocumentChunk[] = [];
let isInitialized = false;

export class RagEngine {
    private chunks: DocumentChunk[] = [];

    constructor() { }

    async init() {
        // If already initialized globally, just use the cache
        if (isInitialized) {
            this.chunks = cachedChunks;
            return;
        }

        const docsDir = path.join(process.cwd(), 'src/data/rag_docs');
        if (fs.existsSync(docsDir)) {
            const files = fs.readdirSync(docsDir).filter(f => f.endsWith('.txt') || f.endsWith('.rtf'));

            for (const file of files) {
                // Use async readFile to avoid blocking the event loop
                let content = await fs.promises.readFile(path.join(docsDir, file), 'utf-8');

                // Simple RTF stripping
                if (file.endsWith('.rtf')) {
                    content = content
                        .replace(/\\par/g, '\n')
                        .replace(/\\tab/g, '\t')
                        .replace(/[{}]/g, '')
                        .replace(/\\[a-z0-9\-]+\s?/g, '') // match commands widely
                        .replace(/\\\*/g, '')
                        .replace(/;/g, '')
                        .replace(/\\'.{2}/g, ''); // Remove hex characters like \'01
                }

                // Split and simple quality filter
                // 1. Must be > 20 chars
                // 2. Must contain spaces (avoid junk words like "TimesNewRoman")
                const parts = content.split('\n').filter(line => {
                    const l = line.trim();
                    return l.length > 20 && l.includes(' ');
                });

                parts.forEach((part, idx) => {
                    cachedChunks.push({
                        id: `${file}-${idx}`,
                        content: part.trim(),
                        source: file
                    });
                });
            }
        }

        this.chunks = cachedChunks;
        isInitialized = true;
    }

    async retrieve(query: string, limit = 3): Promise<DocumentChunk[]> {
        await this.init();

        // Simple mock retrieval: keyword matching
        // In real life, use vector embeddings (cosine similarity)
        const keywords = query.toLowerCase().split(' ').filter(w => w.length > 4);

        const scoredChunks = this.chunks.map(chunk => {
            let score = 0;
            keywords.forEach(kw => {
                if (chunk.content.toLowerCase().includes(kw)) score++;
            });
            return { chunk, score };
        });

        // specific boost for "measurable"
        scoredChunks.forEach(sc => {
            if (sc.chunk.content.toLowerCase().includes("measurable")) sc.score += 2;
        });

        return scoredChunks
            .sort((a, b) => b.score - a.score)
            .filter(item => item.score > 0)
            .slice(0, limit)
            .map(item => item.chunk);
    }

    async validateDocument(fileBuffer: Buffer, mimeType: string): Promise<{ is_relevant: boolean; reason: string }> {
        if (!process.env.GEMINI_API_KEY) {
            return { is_relevant: true, reason: "Skipping validation (No API Key)" };
        }

        try {
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash", generationConfig: { responseMimeType: "application/json" } });

            const prompt = `
            You are a document classifier for a Special Education Advocacy tool.
            Your job is to determine if the attached document is relevant to Special Education, IEPs (Individualized Education Programs), 504 Plans, medical diagnoses (Autism/ADHD/PDA), or school behavior reports.

            Irrelevant documents include: Receipts, unrelated bills, shopping lists, fiction books, random internet articles, car manuals, etc.

            Analyze the first few pages of the document.
            Return JSON:
            {
                "is_relevant": boolean,
                "reason": "Short explanation of what this document appears to be and why it is/is not relevant."
            }
            `;

            const imagePart = {
                inlineData: {
                    data: fileBuffer.toString("base64"),
                    mimeType: mimeType
                }
            };

            const result = await model.generateContent([prompt, imagePart]);
            const response = await result.response;
            const text = response.text();

            try {
                // Clean and parse
                const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
                return JSON.parse(jsonStr);
            } catch (e) {
                console.error("Validation JSON Parse Error:", text);
                return { is_relevant: true, reason: "Validation parser failed, defaulting to allow." }; // Fail open
            }

        } catch (error) {
            console.error("Validation API Error:", error);
            return { is_relevant: true, reason: "Validation API failed, defaulting to allow." }; // Fail open
        }
    }

    async analyzeIEP(fileBuffer: Buffer, mimeType: string) {
        if (!process.env.GEMINI_API_KEY) {
            console.warn("Missing GEMINI_API_KEY, returning mock data.");
            return this.mockAnalysis("Mock PDF Analysis");
        }

        try {
            // 1. Retrieve relevant context (Generic query since we can't read the PDF yet)
            // We search for "goals accommodations compliance" to get the most important reference chunks
            const context = await this.retrieve("IEP goals accommodations and neuroaffirming compliance data", 10);
            const contextSummary = context.map(c => `- ${c.content} (Source: ${c.source})`).join('\n');

            // 2. Call Gemini with Multimodal Input
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash", generationConfig: { responseMimeType: "application/json" } });

            const prompt = `
            You are an expert Special Education advocate and IEP compliance officer, specializing in PDA (Pathological Demand Avoidance) and neuroaffirming practices.
            Evaluate the provided IEP document (attached) against the following best-practice context/guidelines.
            
            GUIDELINES (Reference Material - "PDA Affirming IEP Guide"):
            ${contextSummary}
            
            INSTRUCTIONS:
            1. Analyze the attached IEP PDF thoroughly.
            2. Assign a "PDA Affirming Score" from 0-100 based on how well the IEP aligns with neuroaffirming, low-demand, and relationship-based practices (vs. compliance/compliance-based).
            3. Identify top Strengths and Opportunities for improvement.
            4. Extract and Critique specific items (Goals, Accommodations, Services, Behavior Plans).
            5. For every finding, you MUST cite the "Original Quote" from the PDF and the "Page Number" if detectable.
            
            Output PURE JSON with this structure:
            {
                "score": 75,
                "summary": "Executive summary of the IEP quality (max 2 sentences).",
                "strengths": ["Strength 1...", "Strength 2..."],
                "opportunities": ["Opportunity 1...", "Opportunity 2..."],
                "category_suggestions": {
                    "Goal": { "add": ["Specific goal suggestion 1", "Specific goal suggestion 2"], "remove": ["Harmful compliance goal 1", "Vague goal 2"] },
                    "Accommodation": { "add": ["Sensory break", "Declarative language"], "remove": ["Withholding interest", "Token economy"] },
                    "Service": { "add": [], "remove": [] },
                    "Behavior Plan": { "add": ["Co-regulation"], "remove": ["Planned ignoring"] }
                },
                "results": [
                    {
                        "category": "Goal" | "Accommodation" | "Service" | "Behavior Plan" | "General",
                        "title": "Short title (e.g. Reading Fluency)",
                        "status": "Good" | "Needs Review",
                        "description": "Analysis of the item.",
                        "recommendation": "Specific advice.",
                        "quote": "Exact text from IEP",
                        "page": 1
                    }
                ]
            }
            `;

            const imagePart = {
                inlineData: {
                    data: fileBuffer.toString("base64"),
                    mimeType: mimeType
                }
            };

            const result = await model.generateContent([prompt, imagePart]);
            const response = await result.response;
            const text = response.text();

            // Clean up code blocks if present (though responseMimeType should handle it)
            console.log("Raw Gemini Response:", text); // Debug log

            // 1. Remove markdown code blocks
            let jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();

            // 2. Find the first '{' and the last '}' to strip any preamble/postamble text
            const firstBrace = jsonStr.indexOf('{');
            const lastBrace = jsonStr.lastIndexOf('}');

            if (firstBrace !== -1 && lastBrace !== -1) {
                jsonStr = jsonStr.substring(firstBrace, lastBrace + 1);
            }

            // 3. Attempt parse
            try {
                return JSON.parse(jsonStr);
            } catch (e) {
                // If standard parse fails, try to fix trailing commas (common AI error)
                // This regex removes trailing commas before closing braces/brackets
                const fixedJson = jsonStr.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
                try {
                    return JSON.parse(fixedJson);
                } catch (e2) {
                    console.error("JSON Parse Logic Failed even after fix attempt.");
                    throw e; // Throw original error to trigger fallback
                }
            }

        } catch (error) {
            console.error("Gemini API Error:", error);
            // Fallback to mock if API fails
            return this.mockAnalysis("Error", "AI Service Temporarily Unavailable. Showing offline analysis.");
        }
    }

    private mockAnalysis(text: string, note = "") {
        return {
            score: 42,
            summary: `${note} Offline analysis. The document appears to be an IEP but we could not fully process it.`,
            strengths: ["Document exists", "Contains text"],
            opportunities: ["Connect to AI for full analysis", "Check internet connection"],
            category_suggestions: {
                "Goal": {
                    "add": ["Specific, measurable reading goal", "Self-advocacy goal"],
                    "remove": ["Compliance-based 'will obey' goals"]
                },
                "Accommodation": {
                    "add": ["Access to quiet space", "Headphones"],
                    "remove": ["Token economy system"]
                }
            },
            results: [
                {
                    category: "Goal",
                    title: "Reading Fluency (Offline)",
                    status: "Needs Review",
                    description: "Goal lacks specific time-bound criteria for WPM increase.",
                    recommendation: "Use '120 WPM' instead of 'improve reading'.",
                    quote: "Student will improve reading skills.",
                    page: 1
                },
                {
                    category: "Accommodation",
                    title: "Sensory Breaks (Offline)",
                    status: "Good",
                    description: "Good inclusion of sensory regulation.",
                    recommendation: "Ensure it is student-led.",
                    quote: "Student allowed breaks as needed.",
                    page: 2
                }
            ]
        };
    }
}

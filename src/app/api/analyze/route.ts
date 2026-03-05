import { NextRequest, NextResponse } from "next/server";
import { RagEngine } from "@/lib/rag-engine";

import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

// Use Upstash Redis for distributed rate limiting across serverless containers
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = redisUrl && redisToken ? new Redis({
    url: redisUrl,
    token: redisToken,
}) : null;

// Create a new ratelimiter, that allows 5 requests per 1 minute
const ratelimit = redis ? new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(5, "1 m"),
    analytics: true,
}) : null;

export async function POST(req: NextRequest) {
    // 0. Emergency Kill Switch
    if (process.env.MAINTENANCE_MODE === 'true') {
        return NextResponse.json(
            { error: "Service is temporarily unavailable due to high usage. Please try again later." },
            { status: 503 }
        );
    }

    // 1. Rate Limiting Check
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";

    if (ratelimit) {
        try {
            const { success } = await ratelimit.limit(`ratelimit_analyze_${ip}`);
            if (!success) {
                return NextResponse.json(
                    { error: "Too many requests. Please try again in a minute." },
                    { status: 429 }
                );
            }
        } catch (err) {
            console.error("Rate limiting failed, allowing request:", err);
            // Fail open if Redis is down
        }
    }

    try {
        let formData;
        try {
            formData = await req.formData();
        } catch (e) {
            return NextResponse.json({ error: "Invalid form data or missing content-type" }, { status: 400 });
        }

        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // 2. File Size Validation (Max 10MB)
        const MAX_SIZE_MB = 10;
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            return NextResponse.json(
                { error: `File size exceeds the ${MAX_SIZE_MB}MB limit.` },
                { status: 413 } // Payload Too Large
            );
        }

        if (file.type !== "application/pdf") {
            return NextResponse.json({ error: "Invalid file type. Only PDFs are allowed." }, { status: 400 });
        }

        console.log("Processing upload. Type:", file.type, "Size:", file.size);

        // Convert file to buffer for parsing
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        console.log("PDF received. Size:", buffer.length); // Log size only

        // Check for 'force' flag
        const force = formData.get("force") === "true";

        // RAG Analysis (Multimodal)
        const rag = new RagEngine();

        if (!force) {
            console.log("Validating document relevance...");
            const validation = await rag.validateDocument(buffer, file.type);
            console.log("Validation result:", validation);

            if (!validation.is_relevant) {
                return NextResponse.json({
                    warning: "IrrelevantContent",
                    reason: validation.reason
                }, { status: 400 }); // Using 400 with specific warning payload
            }
        }

        console.log("Starting Multimodal Analysis...");
        const analysis = await rag.analyzeIEP(buffer, file.type);
        console.log("Analysis complete.");

        return NextResponse.json({ success: true, data: analysis });

    } catch (error) {
        console.error("Analysis error:", error);
        return NextResponse.json({ error: "Failed to process document" }, { status: 500 });
    }
}

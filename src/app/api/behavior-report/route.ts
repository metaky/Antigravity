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

// Rate limiting per IP remains as a tertiary defense
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

    // 1. Challenge Token Verification (Primary Bot Defense)
    const challengeId = req.headers.get("X-Challenge-Id");

    if (!challengeId || !redis) {
        console.warn("Request missing challenge ID or Redis not configured");
        return NextResponse.json({ error: "Access denied. Please use the official website." }, { status: 403 });
    }

    try {
        const challengeKey = `challenge:${challengeId}`;
        const isValid = await redis.exists(challengeKey);

        if (!isValid) {
            console.warn(`Invalid or expired challenge ID: ${challengeId}`);
            return NextResponse.json({ error: "Invalid or expired session. Please refresh the page." }, { status: 403 });
        }

        // Single-use: Delete the token immediately after verification
        await redis.del(challengeKey);
    } catch (err) {
        console.error("Challenge verification failed:", err);
        // Fail closed for security - strictly require challenge token
        return NextResponse.json({ error: "Security verification failed." }, { status: 403 });
    }

    // 2. Rate Limiting (Secondary Defense)
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";

    if (ratelimit) {
        try {
            const { success } = await ratelimit.limit(`ratelimit_behavior_${ip}`);
            if (!success) {
                return NextResponse.json(
                    { error: "Too many requests. Please try again in a minute." },
                    { status: 429 }
                );
            }
        } catch (err) {
            console.error("Rate limiting failed, allowing request:", err);
            // Fail open if Redis is down for rate limiting, but not for challenge
        }
    }

    try {
        let formData;
        try {
            formData = await req.formData();
        } catch (e) {
            return NextResponse.json({ error: "Invalid form data or missing content-type" }, { status: 400 });
        }

        const behaviorReport = formData.get("behaviorReport") as File | null;
        const iepDocument = formData.get("iepDocument") as File | null;

        if (!behaviorReport || !iepDocument) {
            return NextResponse.json({ error: "Both Behavior Incident Report and IEP documents are required" }, { status: 400 });
        }

        // File Size Validation (Max 10MB each)
        const MAX_SIZE_MB = 10;
        if (behaviorReport.size > MAX_SIZE_MB * 1024 * 1024) {
            return NextResponse.json(
                { error: `Behavior Report exceeds the ${MAX_SIZE_MB}MB limit.` },
                { status: 413 }
            );
        }
        if (iepDocument.size > MAX_SIZE_MB * 1024 * 1024) {
            return NextResponse.json(
                { error: `IEP document exceeds the ${MAX_SIZE_MB}MB limit.` },
                { status: 413 }
            );
        }

        // File Type Validation
        if (behaviorReport.type !== "application/pdf") {
            return NextResponse.json({ error: "Behavior Report must be a PDF file." }, { status: 400 });
        }
        if (iepDocument.type !== "application/pdf") {
            return NextResponse.json({ error: "IEP document must be a PDF file." }, { status: 400 });
        }

        console.log("Processing dual upload. Behavior Report Size:", behaviorReport.size, "IEP Size:", iepDocument.size);

        // Convert files to buffers
        const behaviorBuffer = Buffer.from(await behaviorReport.arrayBuffer());
        const iepBuffer = Buffer.from(await iepDocument.arrayBuffer());

        console.log("Starting Behavior Report Analysis...");

        // RAG Analysis
        const rag = new RagEngine();
        const analysis = await rag.analyzeBehaviorReport(behaviorBuffer, iepBuffer, "application/pdf");

        console.log("Analysis complete.");

        return NextResponse.json({ success: true, data: analysis });

    } catch (error) {
        console.error("Behavior Report Analysis error:", error);
        return NextResponse.json({ error: "Failed to process documents" }, { status: 500 });
    }
}

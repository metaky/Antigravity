import { NextRequest, NextResponse } from "next/server";
import { RagEngine } from "@/lib/rag-engine";

// Simple in-memory rate limiter
const rateLimit = new Map<string, { count: number; windowStart: number }>();
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5; // 5 requests per minute

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const record = rateLimit.get(ip) || { count: 0, windowStart: now };

    if (now - record.windowStart > WINDOW_MS) {
        record.count = 1;
        record.windowStart = now;
    } else {
        record.count++;
    }

    rateLimit.set(ip, record);
    return record.count > MAX_REQUESTS;
}

export async function POST(req: NextRequest) {
    // 0. Emergency Kill Switch
    if (process.env.MAINTENANCE_MODE === 'true') {
        return NextResponse.json(
            { error: "Service is temporarily unavailable due to high usage. Please try again later." },
            { status: 503 }
        );
    }

    // 1. Rate Limiting Check
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    if (isRateLimited(ip)) {
        return NextResponse.json(
            { error: "Too many requests. Please try again in a minute." },
            { status: 429 }
        );
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

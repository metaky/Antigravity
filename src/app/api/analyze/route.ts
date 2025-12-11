import { NextRequest, NextResponse } from "next/server";
import { RagEngine } from "@/lib/rag-engine";

// Simple in-memory rate limiter (Map<IP, {count, startTime}>)
// Note: This resets on server restart/redeploy. For production scale, use Redis/Upstash.
const rateLimit = new Map<string, { count: number; windowStart: number }>();
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5; // 5 requests per minute

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const record = rateLimit.get(ip) || { count: 0, windowStart: now };

    if (now - record.windowStart > WINDOW_MS) {
        // Reset window
        record.count = 1;
        record.windowStart = now;
    } else {
        record.count++;
    }

    rateLimit.set(ip, record);
    return record.count > MAX_REQUESTS;
}

export async function POST(req: NextRequest) {
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

        console.log("Processing upload:", file.name, "Size:", file.size);

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

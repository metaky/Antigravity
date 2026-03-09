import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { v4 as uuidv4 } from "uuid";

// Initialize Redis for challenge storage
const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function GET() {
    try {
        const challengeId = uuidv4();

        // Store the challenge ID in Redis with a 15-minute TTL
        // Every hit to this endpoint creates a one-time-use token for a human session
        await redis.set(`challenge:${challengeId}`, "valid", { ex: 900 });

        return NextResponse.json({ challengeId });
    } catch (error) {
        console.error("Failed to generate challenge token:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

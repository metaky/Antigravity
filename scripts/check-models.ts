import { GoogleGenerativeAI } from "@google/generative-ai";
// import * as dotenv from "dotenv";
// dotenv.config({ path: '.env.local' });

async function listModels() {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
        console.error("No API Key found.");
        return;
    }

    // Manual fetch because SDK sometimes hides raw list
    // But SDK has a generic request method or we can just try to init known models.
    // Actually, simply fetching the API endpoint is best.
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        console.log("Available Models:");
        if (data.models) {
            data.models.forEach((m: any) => {
                console.log(`- ${m.name} [Supported methods: ${m.supportedGenerationMethods.join(', ')}]`);
            });
        } else {
            console.log("No models returned. Error data:", data);
        }
    } catch (e) {
        console.error("Error fetching models:", e);
    }
}

listModels();

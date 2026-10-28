import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.warn("Missing GEMINI_API_KEY environment variable");
}

export const genAI = new GoogleGenerativeAI(apiKey || "");

// Gemini regularly answers 503 "high demand" for minutes at a time. Try each model in turn, twice each.
const MODELS = ["gemini-2.5-flash", "gemini-3-flash-preview"];
const BUSY = /\b(503|500|429)\b|overloaded|high demand|unavailable/i;

export async function generateText(prompt: string): Promise<string> {
    let lastError: unknown;
    for (const name of MODELS) {
        for (let attempt = 0; attempt < 2; attempt++) {
            try {
                const result = await genAI.getGenerativeModel({ model: name }).generateContent(prompt);
                return result.response.text();
            } catch (error) {
                lastError = error;
                if (!(error instanceof Error && BUSY.test(error.message))) throw error;
                console.warn(`${name} busy (attempt ${attempt + 1}); retrying`);
                await new Promise((resolve) => setTimeout(resolve, 1500 * (attempt + 1)));
            }
        }
    }
    throw lastError;
}

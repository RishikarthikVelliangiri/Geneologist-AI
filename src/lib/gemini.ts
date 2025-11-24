import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.warn("Missing GEMINI_API_KEY environment variable");
}

export const genAI = new GoogleGenerativeAI(apiKey || "");
// Use Gemini 2.5 Flash model for lower-latency responses
export const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

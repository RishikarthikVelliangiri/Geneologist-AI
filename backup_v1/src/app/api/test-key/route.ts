import { NextRequest } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET(_req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json({ ok: false, error: 'GEMINI_API_KEY not set' }, { status: 400 });
  }
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // Minimal lightweight model for a quick credential check
    // Use the 2.5 flash model to reduce latency and use available quota for flash models
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    // Simple prompt; small token usage
    const result = await model.generateContent('ping');
    const text = result.response.text();
    return Response.json({ ok: true, sample: text });
  } catch (err: unknown) {
    let message = 'Unknown error';
    if (err instanceof Error) message = err.message;
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}

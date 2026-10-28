'use server';

import { generateText } from '@/lib/gemini';
import { GenealogyData } from '@/types';

/** True if the URL answers with a raster image. Many Google results are dead, blocked, or HTML pages. */
async function isLoadableImage(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; IdeaGenealogist/1.0)', Range: 'bytes=0-1023' },
      redirect: 'follow',
      signal: AbortSignal.timeout(4000),
    });
    const type = res.headers.get('content-type') ?? '';
    return (res.ok || res.status === 206) && type.startsWith('image/') && !type.includes('svg');
  } catch {
    return false;
  }
}

/** First Google Custom Search image result that actually loads, or undefined. */
async function getGoogleImage(query: string): Promise<string | undefined> {
  const key = process.env.GOOGLE_CUSTOM_SEARCH_API_KEY;
  const cx = process.env.GOOGLE_CUSTOM_SEARCH_ENGINE_ID;
  if (!key || !cx) return undefined;
  try {
    const params = new URLSearchParams({ key, cx, q: query, searchType: 'image', num: '8', safe: 'active' });
    const response = await fetch(`https://www.googleapis.com/customsearch/v1?${params}`, { signal: AbortSignal.timeout(6000) });
    if (!response.ok) {
      console.error(`Google image search failed (${response.status})`);
      return undefined;
    }
    const links: string[] = ((await response.json()).items ?? []).map((item: { link: string }) => item.link).filter((l: string) => l.startsWith('https://'));
    for (const link of links) if (await isLoadableImage(link)) return link;
  } catch (error) {
    console.error('Google image search error:', error);
  }
  return undefined;
}

/** Google Custom Search only: tries each query in order, returns the first image that loads. */
async function findImage(queries: string[]): Promise<string | undefined> {
  for (const query of queries) {
    const url = await getGoogleImage(query);
    if (url) return url;
  }
  return undefined;
}

export async function generateGenealogy(rawConcept: string): Promise<{ success: boolean; data?: GenealogyData; error?: string }> {
  try {
    // Ensure concept is Title Cased for better presentation
    const concept = rawConcept.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    const prompt = `
      You are a historian of ideas. I will give you a concept, and you must map its intellectual lineage.
      
      IMPORTANT: Use simple, accessible language. Be engaging and act like a storyteller. Avoid complex jargon. Write for a general audience so that anyone can understand.
      
      Concept: "${concept}"
      
      Return ONLY valid JSON (no markdown formatting, no code blocks).
      The JSON must strictly follow this schema:
      {
        "concept": "${concept}",
        "summary": "A one-sentence DNA summary of the concept.",
        "image_keywords": "3 single words separated by commas, describing the physical appearance or symbol of the concept (e.g., 'statue,ruins,book' for Stoicism).",
        "roots": [
          { 
            "name": "Name of Ancestor", 
            "contribution": "Brief contribution", 
            "era": "Time period",
            "impact": "How this influenced later thinking (1 sentence)",
            "location": "Geographic origin or cultural context"
          },
          { 
            "name": "Name of Ancestor", 
            "contribution": "Brief contribution", 
            "era": "Time period",
            "impact": "How this influenced later thinking (1 sentence)",
            "location": "Geographic origin or cultural context"
          }
        ],
        "trunk": {
          "key_figure": "The central figure who codified it",
          "defining_work": "The main book/work",
          "year": "Year of publication",
          "context": "Historical/cultural context in 1 sentence",
          "influence": "Major impact or legacy in 1 sentence"
        },
        "branches": [
          { 
            "name": "Modern Evolution 1", 
            "description": "How it evolved",
            "key_proponent": "Notable figure advancing this branch",
            "modern_example": "Real-world application or example today"
          },
          { 
            "name": "Modern Evolution 2", 
            "description": "How it evolved",
            "key_proponent": "Notable figure advancing this branch",
            "modern_example": "Real-world application or example today"
          },
          { 
            "name": "Modern Evolution 3", 
            "description": "How it evolved",
            "key_proponent": "Notable figure advancing this branch",
            "modern_example": "Real-world application or example today"
          },
          { 
            "name": "Modern Evolution 4", 
            "description": "How it evolved",
            "key_proponent": "Notable figure advancing this branch",
            "modern_example": "Real-world application or example today"
          }
        ],
        "rival": {
          "name": "The opposing concept",
          "why_it_opposes": "Brief explanation of the conflict",
          "key_figure": "Main proponent of this rival view",
          "origin": "When/where this opposition emerged"
        }
      }
      
      Be concise. Provide at least 2 roots and 2 branches.
    `;

    const text = await generateText(prompt);

    // Clean up the response if it contains markdown code blocks
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const data = JSON.parse(cleanText) as GenealogyData;

    // Fetch images for the concept, key figure, roots and branches in parallel.
    // Entries with no match keep image_url undefined; the UI draws a typographic placeholder.
    const imagePromises = [
      findImage([concept]).then((url) => {
        data.image_url = url;
      }),
      findImage([`${data.trunk.key_figure} ${concept}`, data.trunk.key_figure]).then((url) => {
        data.trunk.image_url = url;
      }),
      ...data.branches.map(async (branch) => {
        branch.image_url = await findImage([`${branch.name} ${concept}`, branch.key_proponent]);
      }),
      ...data.roots.map(async (root) => {
        root.image_url = await findImage([root.name, `${root.name} ${concept}`]);
      }),
    ];

    await Promise.all(imagePromises);

    // The same photo twice on one page (a branch resolving to the concept's own article) reads as a bug.
    const seen = new Set<string>(data.image_url ? [data.image_url] : []);
    for (const item of [data.trunk, ...data.roots, ...data.branches]) {
      if (!item.image_url) continue;
      if (seen.has(item.image_url)) item.image_url = undefined;
      else seen.add(item.image_url);
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error generating genealogy:", error);

    let errorMessage = "The archives are incomplete. Could not trace this concept.";

    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Stack:", error.stack);

      if (/503|high demand|unavailable/i.test(error.message)) {
        errorMessage = "The historian is busy right now (Gemini is under heavy demand). Please try again in a minute.";
      } else if (error.message.includes("429") || error.message.includes("Quota")) {
        errorMessage = "Rate limit exceeded. The historian is overwhelmed. Please wait a moment before trying again.";
      }
    }

    return { success: false, error: errorMessage };
  }
}

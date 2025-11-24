'use server';

import { model } from '@/lib/gemini';
import { GenealogyData } from '@/types';

async function getGoogleImage(query: string): Promise<string | undefined> {
  try {
    const apiKey = process.env.GOOGLE_CUSTOM_SEARCH_API_KEY;
    const searchEngineId = process.env.GOOGLE_CUSTOM_SEARCH_ENGINE_ID;

    if (!apiKey || !searchEngineId) {
      console.log('Google Custom Search credentials not configured, using fallback');
      return undefined;
    }

    console.log(`Fetching Google image for: ${query}`);
    console.log(`API Key (first 10 chars): ${apiKey.substring(0, 10)}...`);
    console.log(`Search Engine ID: ${searchEngineId}`);

    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(query)}&searchType=image&num=1`;

    const response = await fetch(url);

    if (!response.ok) {
      // Get the error details from Google
      const errorBody = await response.text();
      console.error(`Google Custom Search API error: ${response.status} ${response.statusText}`);
      console.error(`Error details: ${errorBody}`);
      return undefined;
    }

    const data = await response.json();

    if (data.items && data.items.length > 0) {
      const imageUrl = data.items[0].link;
      console.log(`Found Google image: ${imageUrl}`);
      return imageUrl;
    }

    console.log('No Google image found');
  } catch (error) {
    console.error('Error fetching Google image:', error);
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

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up the response if it contains markdown code blocks
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const data = JSON.parse(cleanText) as GenealogyData;

    // Try to fetch image from Google Custom Search
    const googleImage = await getGoogleImage(concept);

    if (googleImage) {
      data.image_url = googleImage;
    } else {
      // Fallback to Flickr if Google search fails or is not configured
      const searchTerm = concept.toLowerCase().replace(/[^a-z0-9]+/g, ',');
      data.image_url = `https://loremflickr.com/1280/720/${searchTerm}/all?lock=${Date.now()}`;
      console.log(`Using Flickr fallback for: ${searchTerm}`);
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error generating genealogy:", error);

    let errorMessage = "The archives are incomplete. Could not trace this concept.";

    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Stack:", error.stack);

      if (error.message.includes("429") || error.message.includes("Quota")) {
        errorMessage = "Rate limit exceeded. The historian is overwhelmed. Please wait a moment before trying again.";
      }
    }

    return { success: false, error: errorMessage };
  }
}

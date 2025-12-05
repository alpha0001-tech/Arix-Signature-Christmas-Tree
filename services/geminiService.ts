import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateLuxuryGreeting = async (): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Write a very short (max 20 words), excessively luxurious, golden, and poetic Christmas greeting suitable for a high-end jewelry brand or royal art installation. Focus on words like 'opulence', 'eternal', 'gold', 'shimmer'. Do not use emojis.",
      config: {
        temperature: 0.8,
      }
    });
    
    return response.text.trim() || "Eternal Gold & Infinite Joy";
  } catch (error) {
    console.error("Failed to generate greeting:", error);
    return "A Season of Opulence & Grace";
  }
};
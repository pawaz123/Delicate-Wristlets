import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini client safely
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key is missing. Stylist feature will not work.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const getStylistAdvice = async (userInput: string): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "I'm sorry, my stylist connection is currently unavailable.";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are a high-end fashion stylist for a luxury bangle brand called 'Delicate-Wristlets'. 
      The user will describe an occasion, an outfit, or a mood. 
      Your goal is to recommend the perfect type of wristwear from our general categories (Gold, Silver, Rose Gold, Diamond).
      
      User Input: "${userInput}"
      
      Provide a short, elegant, and persuasive recommendation (max 3 sentences). Focus on why this style suits the occasion.`,
      config: {
        temperature: 0.7,
      }
    });

    return response.text || "I couldn't generate a recommendation at this time. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Our stylist is currently busy. Please try again later.";
  }
};

import { GoogleGenAI, Modality } from "@google/genai";

// Assume process.env.API_KEY is available in the environment
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const getMimeType = (base64: string): string | null => {
    const match = base64.match(/^data:(image\/[a-zA-Z]+);base64,/);
    return match ? match[1] : null;
};

const cleanBase64 = (base64: string): string => {
    return base64.replace(/^data:image\/[a-zA-Z]+;base64,/, '');
};

export const colorizeImageWithGemini = async (base64Image: string, prompt: string): Promise<string> => {
  const mimeType = getMimeType(base64Image);
  if (!mimeType) {
    throw new Error("Could not determine image MIME type from base64 string.");
  }

  const cleanedBase64 = cleanBase64(base64Image);

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image-preview',
    contents: {
      parts: [
        {
          inlineData: {
            data: cleanedBase64,
            mimeType: mimeType,
          },
        },
        {
          text: prompt,
        },
      ],
    },
    config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
    },
  });
  
  const imagePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);

  if (imagePart && imagePart.inlineData) {
    const colorizedBase64 = imagePart.inlineData.data;
    const colorizedMimeType = imagePart.inlineData.mimeType;
    return `data:${colorizedMimeType};base64,${colorizedBase64}`;
  }

  // Check if text part has refusal message
  const textPart = response.candidates?.[0]?.content?.parts?.find(part => part.text);
  if (textPart && textPart.text) {
    throw new Error(`AI processing failed: ${textPart.text}`);
  }

  throw new Error("Colorization failed: The AI did not return an image.");
};

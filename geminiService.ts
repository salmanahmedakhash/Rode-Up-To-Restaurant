
import { GoogleGenAI, Type } from "@google/genai";
import { AestheticStyle, MenuParsedResponse } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const parseMenuFromText = async (text: string): Promise<MenuParsedResponse> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Extract a list of dishes and their detailed culinary descriptions from the following menu text: \n\n${text}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          dishes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING }
              },
              required: ["name", "description"]
            }
          }
        },
        required: ["dishes"]
      }
    }
  });

  return JSON.parse(response.text) as MenuParsedResponse;
};

const getStylePrompt = (style: AestheticStyle): string => {
  switch (style) {
    case AestheticStyle.RUSTIC_DARK:
      return "Chiaroscuro lighting, dark moody atmosphere, dark wood background, professional fine-dining plating, gourmet food photography, high contrast, warm steam rising, rustic kitchen setting.";
    case AestheticStyle.BRIGHT_MODERN:
      return "Bright airy lighting, minimalist white marble background, high-key photography, clean and crisp aesthetic, vibrant natural colors, professional studio food photography, contemporary plating.";
    case AestheticStyle.SOCIAL_MEDIA:
      return "Flat lay, top-down perspective, overhead shot, Instagram aesthetic, colorful garnishes around the plate, trendy cafe vibe, high resolution, sharp focus on the food details, bright daylight.";
    default:
      return "Professional food photography, high resolution, delicious presentation.";
  }
};

export const generateFoodImage = async (dishName: string, description: string, style: AestheticStyle): Promise<string> => {
  const styleDescription = getStylePrompt(style);
  const prompt = `A professional, hyper-realistic, high-end food photograph of the dish: "${dishName}". Description: ${description}. Aesthetic requirements: ${styleDescription}. No people, no hands, centered composition, elegant plating on a single dish.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: prompt }]
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      }
    }
  });

  // Iterate through parts to find the inlineData image
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  throw new Error("No image was generated");
};

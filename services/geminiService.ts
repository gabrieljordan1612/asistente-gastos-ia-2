
import { GoogleGenAI, Type } from "@google/genai";
import type { ExtractedData } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY is not set in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        amount: {
            type: Type.NUMBER,
            description: "El monto total del gasto en números. Por ejemplo, 15.50.",
        },
        date: {
            type: Type.STRING,
            description: "La fecha del gasto en formato YYYY-MM-DD. Si el año no está presente, usa el año actual.",
        },
        description: {
            type: Type.STRING,
            description: "Una breve descripción del gasto o el nombre del comercio. Por ejemplo, 'Café en Starbucks' o 'Pago Yape a Juan Perez'."
        }
    },
    required: ["amount", "date", "description"],
};

export async function extractExpenseDataFromImage(
  base64Image: string,
  mimeType: string
): Promise<ExtractedData> {
  try {
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: mimeType,
      },
    };

    const textPart = {
        text: `Extrae el monto total, la fecha y una descripción del gasto de esta imagen de un recibo o captura de pantalla de pago (Yape, Plin, etc.). La fecha debe estar en formato YYYY-MM-DD. Si no puedes encontrar alguna información, déjala como nula.`
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });
    
    const jsonText = response.text.trim();
    const parsedData = JSON.parse(jsonText);

    return {
        amount: parsedData.amount || null,
        date: parsedData.date || null,
        description: parsedData.description || null,
    };

  } catch (error) {
    console.error("Error extracting data from image:", error);
    return { amount: null, date: null, description: null };
  }
}

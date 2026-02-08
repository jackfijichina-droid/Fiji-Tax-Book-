
import { GoogleGenAI, Type } from "@google/genai";
import { EntryType } from "../types";

export const performOCR = async (base64Image: string, type: EntryType) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Analyze this receipt/invoice image for a Fiji business. 
    Extract the following details in JSON format:
    - invoiceNo (string)
    - counterpartyName (string)
    - tin (string, if available)
    - date (YYYY-MM-DD)
    - totalAmount (number, inclusive of VAT)
    - vatAmount (number, if explicitly stated, otherwise estimate at 12.5% of net)
    - suggestedCategory (string, pick from common Fiji business categories like 'Stock', 'Rent', 'Utilities', 'Service Sale')

    Context: This is for a ${type === EntryType.INCOME ? 'Money In (Sales)' : 'Money Out (Expense)'} entry.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            invoiceNo: { type: Type.STRING },
            counterpartyName: { type: Type.STRING },
            tin: { type: Type.STRING },
            date: { type: Type.STRING },
            totalAmount: { type: Type.NUMBER },
            vatAmount: { type: Type.NUMBER },
            suggestedCategory: { type: Type.STRING }
          },
          required: ["invoiceNo", "counterpartyName", "date", "totalAmount"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("OCR Error:", error);
    throw error;
  }
};

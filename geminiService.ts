
import { GoogleGenAI } from "@google/genai";

export const getClinicalInsight = async (diagnosis: string, treatment: string) => {
  // Always use process.env.API_KEY directly in the constructor.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `بصفتك مساعد طبي ذكي لعيادة أسنان، قدم نصيحة موجزة جداً (بالعربية) بناءً على التشخيص: ${diagnosis} والعلاج: ${treatment}. ركز على نصائح العناية المنزلية للمريض.`,
      config: {
        systemInstruction: "You are a specialized dental clinical assistant. Respond in clear, professional Arabic.",
        temperature: 0.7,
      }
    });
    // Extracting text output directly from GenerateContentResponse via the .text property (not a method).
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "لا يمكن الحصول على استشارة ذكية حالياً.";
  }
};

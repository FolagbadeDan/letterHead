import { GoogleGenAI, Type } from "@google/genai";
import { NextResponse } from "next/server";

const apiKey = process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || '' });

const parseResponseSchema = {
  type: Type.OBJECT,
  properties: {
    recipientName: { type: Type.STRING, description: "Recipient name" },
    recipientAddress: { type: Type.STRING, description: "Recipient address" },
    subject: { type: Type.STRING, description: "Email subject" },
    body: { type: Type.STRING, description: "HTML body content" },
  },
  required: ["recipientName", "subject", "body"],
};

export async function POST(req: Request) {
  if (!apiKey) {
    console.error("API_KEY is missing in server environment");
    return NextResponse.json({ error: 'Server API Key missing' }, { status: 500 });
  }

  let rawText = "";

  try {
    // Read body once and store it
    const bodyData = await req.json();
    rawText = bodyData.rawText;

    if (!rawText) return NextResponse.json({ error: 'Raw text is required' }, { status: 400 });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze input: "${rawText}". Extract recipient details, subject, and write professional HTML body.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: parseResponseSchema,
      },
    });

    // Check if response has text
    if (!response.text) {
        throw new Error("Empty response from AI");
    }

    return NextResponse.json(JSON.parse(response.text));

  } catch (error) {
    console.error("Backend Parse Error:", error);
    
    // Fallback using the stored rawText variable, NOT req.json()
    return NextResponse.json({ 
        recipientName: "",
        recipientAddress: "",
        subject: "General Correspondence",
        body: `<p>${rawText || "Could not parse content."}</p>` 
    });
  }
}
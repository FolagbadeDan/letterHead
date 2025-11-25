import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const apiKey = process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy_key' });

const SYSTEM_INSTRUCTION = `You are an expert professional business correspondence assistant. 
Your goal is to write clear, concise, and professionally formatted business letters.`;

export async function POST(req: Request) {
  if (!apiKey) {
    return NextResponse.json({ error: 'Server API Key missing' }, { status: 500 });
  }

  try {
    const { text } = await req.json();
    if (!text) return NextResponse.json({ error: 'Text is required' }, { status: 400 });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Rewrite the following text to be more professional, concise, and grammatically correct. Return only the HTML body content, no markdown formatting: \n\n${text}`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.5,
      },
    });

    return NextResponse.json({ text: response.text || text });
  } catch (error) {
    console.error("Backend Improve Error:", error);
    return NextResponse.json({ error: 'Failed to improve text' }, { status: 500 });
  }
}
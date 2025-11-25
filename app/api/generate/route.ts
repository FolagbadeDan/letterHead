
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Import shared options
import { db } from "@/lib/db";

const apiKey = process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy_key' });

const SYSTEM_INSTRUCTION = `You are an expert professional business correspondence assistant. 
Your goal is to write clear, concise, and professionally formatted business letters.
When asked to draft a letter, produce the body content in HTML format (using <p>, <br>, <strong>, <ul>, <li> tags).
Do not wrap the output in markdown code blocks. Just return the raw HTML string for the body.
Maintain a polite and professional tone suitable for corporate environments.`;

export async function POST(req: Request) {
  // CRITICAL FIX: Pass authOptions to getServerSession
  const session = await getServerSession(authOptions);
  
  let userPlan = 'FREE';
  let userId = null;

  if (session && session.user) {
    // @ts-ignore
    userPlan = session.user.plan || 'FREE';
    // @ts-ignore
    userId = session.user.id;
  } else {
     // Force login for AI usage as per requirements
     return NextResponse.json({ error: 'LOGIN_REQUIRED' }, { status: 401 });
  }

  // Limit Check Logic
  if (userId) {
    const currentUsage = await db.incrementAIUsage(userId);
    // Free limit: 3 requests
    if (userPlan === 'FREE' && currentUsage > 3) {
      return NextResponse.json({ error: 'LIMIT_REACHED', message: "You have reached your free AI limit." }, { status: 403 });
    }
  }

  if (!apiKey) {
    return NextResponse.json({ error: 'Server API Key is missing.' }, { status: 500 });
  }

  try {
    const { prompt } = await req.json();
    if (!prompt) return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Draft a business letter body based on the following request: ${prompt}`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    return NextResponse.json({ text: response.text || '' });
  } catch (error: any) {
    console.error("Backend Generate Error:", error);
    return NextResponse.json({ error: error.message || 'Failed to generate content' }, { status: 500 });
  }
}

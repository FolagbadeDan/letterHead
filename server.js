import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Middleware
app.use(cors());
app.use(express.json());

// Logging Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Initialize Gemini API Client
const apiKey = process.env.API_KEY || process.env.GOOGLE_API_KEY;

if (!apiKey) {
  console.warn("⚠️  WARNING: API_KEY is missing in environment variables. AI features will fail.");
}

const ai = new GoogleGenAI({ apiKey: apiKey });

// Shared System Instruction for consistent persona
const SYSTEM_INSTRUCTION = `You are an expert professional business correspondence assistant. 
Your goal is to write clear, concise, and professionally formatted business letters.
When asked to draft a letter, produce the body content in HTML format (using <p>, <br>, <strong>, <ul>, <li> tags).
Do not wrap the output in markdown code blocks. Just return the raw HTML string for the body.
Maintain a polite and professional tone suitable for corporate environments.`;

// Schema for strict JSON parsing
const parseResponseSchema = {
  type: Type.OBJECT,
  properties: {
    recipientName: { 
      type: Type.STRING,
      description: "The name of the person or company receiving the letter. Use '[Recipient Name]' if unknown."
    },
    recipientAddress: { 
      type: Type.STRING,
      description: "The full address of the recipient, with line breaks preserved as \n. Empty string if unknown."
    },
    subject: { 
      type: Type.STRING,
      description: "A professional and concise subject line for the letter."
    },
    body: { 
      type: Type.STRING,
      description: "The main content of the letter formatted as HTML. Use <p> for paragraphs. Do NOT include salutations (Dear X) or sign-offs (Sincerely), only the body paragraphs."
    },
  },
  required: ["recipientName", "subject", "body"],
};

// --- API Routes ---

/**
 * POST /api/generate
 * Drafts a new letter based on a prompt.
 */
app.post('/api/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    // Use gemini-2.5-flash without thinkingConfig for speed and compatibility
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Draft a business letter body based on the following request: ${prompt}`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text || '' });
  } catch (error) {
    console.error('Backend Generate Error:', error);
    res.status(500).json({ error: 'Failed to generate content.' });
  }
});

/**
 * POST /api/improve
 * Rewrites existing text to be more professional.
 */
app.post('/api/improve', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Rewrite the following text to be more professional, concise, and grammatically correct. Return only the HTML body content, no markdown formatting: \n\n${text}`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.5,
      },
    });

    res.json({ text: response.text || text });
  } catch (error) {
    console.error('Backend Improve Error:', error);
    res.status(500).json({ error: 'Failed to improve text.' });
  }
});

/**
 * POST /api/parse
 * Structured extraction from raw text for the Landing Page.
 */
app.post('/api/parse', async (req, res) => {
  try {
    const { rawText } = req.body;
    if (!rawText) return res.status(400).json({ error: 'Raw text is required' });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
        Analyze the following raw input text. It may be a rough draft, bullet points, or a scattered request for a letter.
        
        Task:
        1. Extract or infer a Recipient Name.
        2. Extract or infer a Recipient Address.
        3. Generate a professional Subject Line.
        4. Rewrite the core message into a professional business letter Body (HTML format).
        
        Input Text:
        "${rawText}"
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: parseResponseSchema,
      },
    });

    // With schema, response.text is guaranteed to be valid JSON
    const jsonResponse = JSON.parse(response.text);
    res.json(jsonResponse);

  } catch (error) {
    console.error('Backend Parse Error:', error);
    // Graceful fallback 
    res.json({ 
      recipientName: "",
      recipientAddress: "",
      subject: "General Correspondence",
      body: `<p>${req.body.rawText}</p>` 
    });
  }
});

// --- Production Setup ---
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
});
import { LetterContent } from "../types";

export const generateLetterContent = async (prompt: string): Promise<string> => {
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });

  if (!res.ok) {
    const err = await res.json();
    if (res.status === 403) throw new Error("LIMIT_REACHED");
    throw new Error(err.error || "Failed to generate content");
  }

  const data = await res.json();
  return data.text;
};

export const improveText = async (text: string): Promise<string> => {
  const res = await fetch('/api/improve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });

  if (!res.ok) {
    const err = await res.json();
    if (res.status === 403) throw new Error("LIMIT_REACHED");
    return text;
  }

  const data = await res.json();
  return data.text || text;
};

export const parseRawInput = async (rawText: string): Promise<Partial<LetterContent>> => {
  const res = await fetch('/api/parse', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rawText })
  });

  if (!res.ok) {
    console.error("Parse request failed");
    return {
       recipientName: "",
       recipientAddress: "",
       subject: "General Correspondence",
       body: `<p>${rawText}</p>`
    };
  }

  return res.json();
};
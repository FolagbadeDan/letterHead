import { LetterContent, CompanyProfile, SavedLetter } from "../types";

export const saveLetterToCloud = async (name: string, content: LetterContent, profile: CompanyProfile) => {
  const res = await fetch('/api/letters', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, content, profile })
  });

  if (res.status === 403) throw new Error("LIMIT_REACHED");
  if (!res.ok) throw new Error("Failed to save");
  return res.json();
};

export const fetchMyLetters = async (): Promise<SavedLetter[]> => {
  const res = await fetch('/api/letters');
  if (!res.ok) return [];
  return res.json();
};
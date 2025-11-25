import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { User, SavedLetter, CompanyProfile } from '../types';

// Fix TS error: Property 'cwd' does not exist on type 'Process'
const DB_PATH = path.join((process as any).cwd(), 'data');
const DB_FILE = path.join(DB_PATH, 'db.json');

interface DBSchema {
  users: Array<User & { passwordHash: string }>;
  letters: SavedLetter[];
  profiles: Record<string, CompanyProfile>; 
}

// Helper to ensure DB exists and is valid
async function initDB() {
  try {
    await fs.mkdir(DB_PATH, { recursive: true });
    try {
      await fs.access(DB_FILE);
    } catch {
      // Create default DB if it doesn't exist
      await fs.writeFile(DB_FILE, JSON.stringify({ users: [], letters: [], profiles: {} }, null, 2));
    }
  } catch (e) {
    console.error("DB Init Error:", e);
  }
}

async function readDB(): Promise<DBSchema> {
  await initDB();
  try {
    const data = await fs.readFile(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    console.error("DB Read Error - Resetting DB:", e);
    return { users: [], letters: [], profiles: {} };
  }
}

async function writeDB(data: DBSchema) {
  await initDB();
  await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
}

export const db = {
  findUserByEmail: async (email: string) => {
    const db = await readDB();
    return db.users.find(u => u.email === email);
  },
  
  createUser: async (user: Omit<User, 'id' | 'plan' | 'aiUsageCount'> & { passwordHash: string }) => {
    const data = await readDB();
    const newUser = {
      ...user,
      id: crypto.randomUUID(),
      plan: 'FREE' as const,
      aiUsageCount: 0
    };
    data.users.push(newUser);
    await writeDB(data);
    return newUser;
  },

  incrementAIUsage: async (userId: string) => {
    const data = await readDB();
    const userIndex = data.users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      const current = data.users[userIndex].aiUsageCount || 0;
      data.users[userIndex].aiUsageCount = current + 1;
      await writeDB(data);
      return data.users[userIndex].aiUsageCount;
    }
    return 0;
  },

  getLetters: async (userId: string) => {
    const data = await readDB();
    return data.letters.filter(l => l.userId === userId);
  },

  saveLetter: async (userId: string, letter: Omit<SavedLetter, 'id' | 'userId' | 'lastModified'>) => {
    const data = await readDB();
    const user = data.users.find(u => u.id === userId);
    const existingLetters = data.letters.filter(l => l.userId === userId);

    if (user && user.plan === 'FREE' && existingLetters.length >= 1) {
       throw new Error("LIMIT_REACHED");
    }

    const newLetter: SavedLetter = {
      id: crypto.randomUUID(),
      userId,
      lastModified: Date.now(),
      ...letter
    };

    data.letters.push(newLetter);
    await writeDB(data);
    return newLetter;
  }
};
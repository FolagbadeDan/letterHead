
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Import shared options
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    // @ts-ignore
    const saved = await db.saveLetter(session.user.id, body);
    return NextResponse.json(saved);
  } catch (error: any) {
    if (error.message === "LIMIT_REACHED") {
      return NextResponse.json({ error: "Free plan limit reached. Upgrade to save more." }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // @ts-ignore
  const letters = await db.getLetters(session.user.id);
  return NextResponse.json(letters);
}

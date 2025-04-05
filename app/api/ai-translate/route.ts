// app/api/translate/route.ts
"use server"
import { NextRequest, NextResponse } from "next/server";
import { AiTranslate } from "@/app/(utils)/groqApi/transplate";

export async function POST(req: NextRequest) {
  const { content, lang } = await req.json();
    // Check if content is too long (e.g., more than 5000 characters)
    if (content.length > 50000) {
      return NextResponse.json({ result: "text too long..." });
    }
  const result = await AiTranslate(content, lang);
  return NextResponse.json({ result });
}
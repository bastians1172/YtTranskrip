// app/api/translate/route.ts
"use server"
import { NextRequest, NextResponse } from "next/server";
import { AiTranslate } from "@/app/(utils)/groqApi/transplate";

export async function POST(req: NextRequest) {
  const { content, lang } = await req.json();
  const result = await AiTranslate(content, lang);
  return NextResponse.json({ result });
}
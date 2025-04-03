"use server"
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: "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" });

function splitTextIntoChunks(text: string, wordsPerChunk: number): string[] {
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  for (let i = 0; i < words.length; i += wordsPerChunk) {
    chunks.push(words.slice(i, i + wordsPerChunk).join(' '));
  }
  return chunks;
}

export async function AiTranslate(content: string, lang: string) {
  try {
    console.log("translate", lang);
    const chunks = splitTextIntoChunks(content, 100); // Split into chunks of 100 words
    const translations = await Promise.all(
      chunks.map(chunk => getGroqChatCompletion(chunk, lang))
    );
    const result = translations
      .map(trans => trans.choices[0]?.message?.content || "")
      .join(" ");
      console.log("result :", result);
    return result;
  } catch (error) {
    console.error("Error:", error);
    return "Error fetching translation";
  }
}

export async function getGroqChatCompletion(content:string,lang:string) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `Terjemahkan teks berikut ke ${lang}: ${content}. Kembalikan hanya teks yang diterjemahkan`,
      },
    ],
    model: "llama-3.3-70b-versatile",
  });
}

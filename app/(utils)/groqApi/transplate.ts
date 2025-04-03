"use server"
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: "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" });

export async function main(content:string,lang:string) {
  const chatCompletion = await getGroqChatCompletion(content);
  // Print the completion returned by the LLM.
  console.log(chatCompletion.choices[0]?.message?.content || "");
  return chatCompletion.choices[0]?.message?.content || "";
}

export async function getGroqChatCompletion(content:string,) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `translate text tersebut ke bahasa dengan kode ${content}, catatan "respons hanya dengan translateya saja jangan merespon kata kata selain translatenya": ${content}`,
      },
    ],
    model: "llama-3.2-90b-vision-preview",
  });
}

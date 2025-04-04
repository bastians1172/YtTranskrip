"use server";
import Groq from "groq-sdk";
const languages = [
  { code: "af", label: "Afrikaans" },
  { code: "sq", label: "Albanian" },
  { code: "am", label: "Amharic" },
  { code: "ar", label: "Arabic" },
  { code: "hy", label: "Armenian" },
  { code: "az", label: "Azerbaijani" },
  { code: "eu", label: "Basque" },
  { code: "be", label: "Belarusian" },
  { code: "bn", label: "Bengali" },
  { code: "bs", label: "Bosnian" },
  { code: "bg", label: "Bulgarian" },
  { code: "ca", label: "Catalan" },
  { code: "ceb", label: "Cebuano" },
  { code: "ny", label: "Chichewa" },
  { code: "zh-CN", label: "Chinese (Simplified)" },
  { code: "zh-TW", label: "Chinese (Traditional)" },
  { code: "co", label: "Corsican" },
  { code: "hr", label: "Croatian" },
  { code: "cs", label: "Czech" },
  { code: "da", label: "Danish" },
  { code: "nl", label: "Dutch" },
  { code: "en", label: "English" },
  { code: "eo", label: "Esperanto" },
  { code: "et", label: "Estonian" },
  { code: "tl", label: "Filipino" },
  { code: "fi", label: "Finnish" },
  { code: "fr", label: "French" },
  { code: "fy", label: "Frisian" },
  { code: "gl", label: "Galician" },
  { code: "ka", label: "Georgian" },
  { code: "de", label: "German" },
  { code: "el", label: "Greek" },
  { code: "gu", label: "Gujarati" },
  { code: "ht", label: "Haitian Creole" },
  { code: "ha", label: "Hausa" },
  { code: "haw", label: "Hawaiian" },
  { code: "iw", label: "Hebrew" },
  { code: "hi", label: "Hindi" },
  { code: "hmn", label: "Hmong" },
  { code: "hu", label: "Hungarian" },
  { code: "is", label: "Icelandic" },
  { code: "ig", label: "Igbo" },
  { code: "id", label: "Indonesian" },
  { code: "ga", label: "Irish" },
  { code: "it", label: "Italian" },
  { code: "ja", label: "Japanese" },
  { code: "jw", label: "Javanese" },
  { code: "kn", label: "Kannada" },
  { code: "kk", label: "Kazakh" },
  { code: "km", label: "Khmer" },
  { code: "ko", label: "Korean" },
  { code: "ku", label: "Kurdish (Kurmanji)" },
  { code: "ky", label: "Kyrgyz" },
  { code: "lo", label: "Lao" },
  { code: "la", label: "Latin" },
  { code: "lv", label: "Latvian" },
  { code: "lt", label: "Lithuanian" },
  { code: "lb", label: "Luxembourgish" },
  { code: "mk", label: "Macedonian" },
  { code: "mg", label: "Malagasy" },
  { code: "ms", label: "Malay" },
  { code: "ml", label: "Malayalam" },
  { code: "mt", label: "Maltese" },
  { code: "mi", label: "Maori" },
  { code: "mr", label: "Marathi" },
  { code: "mn", label: "Mongolian" },
  { code: "my", label: "Myanmar (Burmese)" },
  { code: "ne", label: "Nepali" },
  { code: "no", label: "Norwegian" },
  { code: "ps", label: "Pashto" },
  { code: "fa", label: "Persian" },
  { code: "pl", label: "Polish" },
  { code: "pt", label: "Portuguese" },
  { code: "pa", label: "Punjabi" },
  { code: "ro", label: "Romanian" },
  { code: "ru", label: "Russian" },
  { code: "sm", label: "Samoan" },
  { code: "gd", label: "Scots Gaelic" },
  { code: "sr", label: "Serbian" },
  { code: "st", label: "Sesotho" },
  { code: "sn", label: "Shona" },
  { code: "sd", label: "Sindhi" },
  { code: "si", label: "Sinhala" },
  { code: "sk", label: "Slovak" },
  { code: "sl", label: "Slovenian" },
  { code: "so", label: "Somali" },
  { code: "es", label: "Spanish" },
  { code: "su", label: "Sundanese" },
  { code: "sw", label: "Swahili" },
  { code: "sv", label: "Swedish" },
  { code: "tg", label: "Tajik" },
  { code: "ta", label: "Tamil" },
  { code: "te", label: "Telugu" },
  { code: "th", label: "Thai" },
  { code: "tr", label: "Turkish" },
  { code: "uk", label: "Ukrainian" },
  { code: "ur", label: "Urdu" },
  { code: "uz", label: "Uzbek" },
  { code: "vi", label: "Vietnamese" },
  { code: "cy", label: "Welsh" },
  { code: "xh", label: "Xhosa" },
  { code: "yi", label: "Yiddish" },
  { code: "yo", label: "Yoruba" },
  { code: "zu", label: "Zulu" },
];
const regex = /<think>[\s\S]*?<\/think>/g;

// Daftar API key yang bisa digunakan
const API_KEYS = process.env.GROQ_API_KEYS?.split(',') ?? []

let apiKeyIndex = 0;

function getNextApiKey(): string {
  const key = API_KEYS[apiKeyIndex];
  apiKeyIndex = (apiKeyIndex + 1) % API_KEYS.length;
  return key;
}

function createGroqInstance() {
  return new Groq({ apiKey: getNextApiKey() });
}

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
    for (let i = 0; i < languages.length; i++) {
      if (languages[i].code === lang) {
        lang = languages[i].label;
        break;
      }
    }
    console.log("Mulai menerjemahkan ke bahasa:", lang);
    const chunks = splitTextIntoChunks(content, 250);

    const translations = await Promise.all(
      chunks.map(chunk => getGroqChatCompletion(chunk, lang))
    );

    // Check if any translation chunk failed
    const hasFailedTranslation = translations.some(
      trans => !trans?.choices?.[0]?.message?.content
    );

    if (hasFailedTranslation) {
      return "Translation Server Error: Some parts could not be translated";
    }

    const result = translations
      .map(trans => trans?.choices?.[0]?.message?.content?.replace(regex, '').trim())
      .join(" ");
    return result;
  } catch (error) {
    console.error("Terjadi error pada penerjemahan:", error);
    return "Translation Server Error: Failed to process request";
  }
}

export async function getGroqChatCompletion(content: string, lang: string, retries = 1) {
  const groq = createGroqInstance();
  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Terjemahkan teks berikut ke ${lang}: ${content}. Kembalikan hanya teks yang diterjemahkan`,
        },
      ],
      model: "deepseek-r1-distill-llama-70b",
    });
    return response;
  } catch (error) {
    console.error("Error pada getGroqChatCompletion dengan API key:", groq.apiKey, error);
    if (retries > 0) {
      console.log("Mencoba ulang request dengan API key baru. Sisa percobaan:", retries);
      return getGroqChatCompletion(content, lang, retries - 1);
    }
    throw error;
  }
}

"use server"
// app/api/translate/route.ts
import { NextRequest } from 'next/server';
import axios from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';

export async function POST(req: NextRequest) {
  console.log('Starting translation request...');
  const body = await req.json();
  const { content, lang } = body;
  console.log('Input received:', { contentLength: content?.length, lang });

  // Validasi input
  if (!content || !lang) {
    console.log('Validation failed: Missing content or lang');
    return new Response(JSON.stringify({ error: 'Missing content or lang' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Inisialisasi cookie jar dan client axios
    const jar = new CookieJar();
    const client = wrapper(axios.create({ jar }));
    console.log('Axios client initialized with cookie jar');

    // Langkah 1: Ambil cookie dari Google Translate
    await client.get('https://translate.google.com');
    console.log('Retrieved cookies from Google Translate');

    // Langkah 2: Pecah teks menjadi bagian kecil jika terlalu panjang
    const chunks = splitTextIntoChunks(content, 4000);
    console.log(`Text split into ${chunks.length} chunks`);

    // Langkah 3: Terjemahkan setiap bagian secara bersamaan
    console.log('Starting translation of chunks...');
    const translatedChunks = await Promise.all(
      chunks.map(chunk => translateChunk(chunk, 'auto', lang, client))
    );
    console.log('All chunks translated successfully');

    // Langkah 4: Gabungkan hasil terjemahan
    const translatedText = translatedChunks.join('');
    console.log('Translation completed, result length:', translatedText.length);

    // Kembalikan hasil
    return new Response(JSON.stringify({ result: translatedText }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error during translation:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Fungsi untuk memecah teks menjadi bagian kecil
function splitTextIntoChunks(text: string, maxChunkSize: number): string[] {
  const paragraphs = text.split('\n');
  const chunks: string[] = [];
  let currentChunk = '';

  for (const paragraph of paragraphs) {
    if (currentChunk.length + paragraph.length + 1 > maxChunkSize) {
      if (currentChunk) {
        chunks.push(currentChunk);
        currentChunk = '';
      }
      if (paragraph.length > maxChunkSize) {
        // Jika paragraf terlalu panjang, pecah berdasarkan kata
        const words = paragraph.split(' ');
        for (const word of words) {
          if (currentChunk.length + word.length + 1 > maxChunkSize) {
            chunks.push(currentChunk);
            currentChunk = word;
          } else {
            currentChunk += (currentChunk ? ' ' : '') + word;
          }
        }
      } else {
        currentChunk = paragraph;
      }
    } else {
      currentChunk += (currentChunk ? '\n' : '') + paragraph;
    }
  }
  if (currentChunk) {
    chunks.push(currentChunk);
  }
  return chunks;
}

// Fungsi untuk menerjemahkan satu bagian teks
async function translateChunk(text: string, sourceLang: string, targetLang: string, client: any): Promise<string> {
  // Buat parameter f.req untuk request
  const translationParams = [[text, sourceLang, targetLang, 1], []];
  const innerArray = ["MkEWBc", JSON.stringify(translationParams), null, "generic"];
  const fReqValue = JSON.stringify([[innerArray]]);
  const body = `f.req=${encodeURIComponent(fReqValue)}`;

  // Atur header untuk request
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
    'Accept': '*/*',
    'Origin': 'https://translate.google.com',
    'Referer': 'https://translate.google.com/'
  };

  // URL endpoint Google Translate
  const url = 'https://translate.google.com/_/TranslateWebserverUi/data/batchexecute?rpcids=MkEWBc&source-path=%2F&bl=boq_translate-webserver_20250402.08_p0&hl=en-US&soc-app=1&soc-platform=1&soc-device=1&rt=c';

  // Kirim request POST
  const response = await client.post(url, body, { headers });

  // Parsing hasil response
  const rawData = response.data.replace(")]}'", "");
  const lines = rawData.split('\n').filter((line: string) => line.trim() !== '');
  const firstArrayLine = lines[1];
  const parsedData = JSON.parse(firstArrayLine);
  const translationArray = parsedData[0][2];
  const translationData = JSON.parse(translationArray);
  const translation = translationData[1][0][0][5][0][0];

  return translation;
}
"use client";
import { useState } from "react";
import getTranscript from "./api/transcript/getTranscript";
import LanguageSelect from "./language";
import Image from "next/image";
import downloadTranscript from "./downloadTranscript";
import {handleDownloadPDF} from "./pdfDocument";


import React from 'react';
import ReactPDF from '@react-pdf/renderer';



function checkUrl(url: string): boolean {
  return url.includes("youtube.com/watch?v=") || 
         url.includes("youtu.be/") || 
         url.includes("youtube.com/shorts/");
}

function extractVideoId(url: string): string | null {
  const regExp =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:shorts\/|[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regExp);
  return match && match[1] ? match[1] : null;
}

function convertShortsUrl(url: string): string {
  if (url.includes("youtube.com/shorts/")) {
    const videoId = url.split("shorts/")[1].split("?")[0];
    return `https://www.youtube.com/watch?v=${videoId}`;
  }
  return url;
}

export default function Home() {
  const [isTranslating, setIsTranslating] = useState(false);
  const [url, setUrl] = useState("");
  const [originalTranscript, setOriginalTranscript] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [copiedText, setCopiedText] = useState("Copy Teks");
  const[erroTranslate,setErrorTranslate]=useState(false)
  const [isAiTraslate, setIsAiTranslate] = useState(false);
  const handleGetTranscript = async (e: React.FormEvent<HTMLFormElement>) => {
    setErrorTranslate(false);
    e.preventDefault();
    if (!checkUrl(url)) {
      setResult("Masukkan URL YouTube yang valid");
      return;
    }
    setLoading(true);
    try {
      const data = await getTranscript(convertShortsUrl(url));
      setOriginalTranscript(data);
      setResult(data);
    } catch (error) {
      console.error("Error fetching transcript:", error);
      setResult("Error transcript");
    } finally {
      setLoading(false);
    }
  };

  const handleAITranslate = async () => {
    if (!result) return;

    // setResult("Translating... Please wait");
    setIsTranslating(true);
    setIsAiTranslate(true);
    setErrorTranslate(false);
    try {
      const response = await fetch("/api/ai-translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: originalTranscript,
          lang: selectedLanguage, // Use selected language from state
        }),
      });

      if (!response.ok) {
        // throw new Error(`HTTP error! status: ${response.status}`);
          const errorData = await response.json();
          // setResult(errorData.error || "An error occurred during translation");
      }

      const data = await response.json();
      if (!data.result) {
        throw new Error('No result in response');
      }

      setResult(data.result);
    } catch (error) {
      console.error('Translation error:', error);
      setErrorTranslate(true);
      // setResult("Couldn't translate. Try again later.");
    } finally {
      setTimeout(() => setIsAiTranslate(false), 5000);
      setTimeout(() => setIsTranslating(false), 5000);
    }
  };


  const handleTranslate = async () => {
    if (!result) return;
    setErrorTranslate(false);
    setIsTranslating(true);
  
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: originalTranscript,
          lang: selectedLanguage,
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        console.error("Server error:", data.error || "Unknown error");
        throw new Error(data.error || "Terjadi kesalahan saat menerjemahkan.");
      }
  
      if (!data.result) {
        throw new Error("Tidak ada hasil terjemahan.");
      }
  
      setResult(data.result);
    } catch (error) {
      setErrorTranslate(true);
      console.error("Translation error:", error);
      // Misal kamu punya state setError:
      // setError(error.message);

    } finally {
      setIsTranslating(false)
    }
  };
  

  
  const handleCopy = async () => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) {
      setCopiedText("Can't Copy");
      setTimeout(() => {
      setCopiedText("Copy Text");
      }, 4000);
        return;
    }
    try {
      setCopiedText("Copied");
      setTimeout(() => {
        setCopiedText("Copy Text");
      }, 4000);
      await navigator.clipboard.writeText(result);
    } catch (error) {
      setCopiedText("Can't Copy");
      setTimeout(() => {
        setCopiedText("Copy Text");
      }, 4000);    }
  };
  const videoId = extractVideoId(url);
  return (
    <div className="flex flex-col items-center min-h-screen font-roboto w-full px-4">
      {/* Judul halaman untuk SEO dan semantik */}
      <h1 className="text-3xl md:text-4xl font-bold text-center mt-10 mb-6">YouTube Transcript Generator</h1>
      
      {/* Formulir input URL */}
      <div className="flex flex-col items-center justify-center p-4 w-full max-w-2xl mx-auto">
        <form onSubmit={handleGetTranscript} className="flex flex-col gap-6 justify-center items-center w-full">
          <label htmlFor="urlInput" className="text-xl md:text-2xl font-bold text-center mb-2">
            Enter YouTube URL for Transcript
          </label>
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <input
              id="urlInput"
              name="urlInput"
              type="text"
              placeholder="Enter YouTube URL (example: https://www.youtube.com/watch?v=...)"
              className="w-full md:flex-1 min-w-0 h-[52px] px-4 font-opensans text-base leading-[26px] bg-transparent 
                border border-[#BCC1CAFF] rounded-md
                hover:border-[#A7ADB7FF] hover:text-[#BCC1CAFF]
                focus:border-[#9095A0FF] focus:text-[#BCC1CAFF] 
                disabled:border-[#BCC1CAFF] disabled:text-[#BCC1CAFF]
                outline-none"
              value={url}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
              required
            />
            <button type="submit" className="w-full md:w-[200px] h-[52px] flex items-center justify-center bg-[#EEB866FF] hover:bg-[#E79924FF] active:bg-[#CE8517FF] disabled:opacity-40 text-white font-opensans text-lg leading-7 rounded-lg transition-colors">
              Generate Transcript
            </button>
          </div>
        </form>
      </div>
  
      {/* Hasil transkrip */}
      <div className="mt-5 flex flex-col w-full max-w-2xl mx-auto border-2 border-amber-500 rounded-lg p-5 gap-2">
        {loading ? (
            <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mb-4"></div>
            <p className="text-center text-lg">Loading transcript...</p>
            </div>
        ) : (
          <div className="flex flex-col items-center gap-2 justify-center w-full">
            {result ? (
              <>
                {/* Iframe responsif dengan rasio aspek */}
                <div className="w-full aspect-video">
                  <iframe
                    className="w-full h-full rounded-lg border-0"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title="YouTube video player"
                  />
                </div>
                
                {/* Tombol aksi */}
                <div className="flex flex-col md:flex-row gap-2 my-5">
                  <button onClick={handleCopy} className="w-full md:w-[140px] h-[35px] flex items-center justify-center gap-2 bg-[#EEB866FF] hover:bg-[#E79924FF] active:bg-[#CE8517FF] disabled:opacity-40 text-white font-opensans text-lg leading-7 rounded-lg transition-colors">
                    <Image src="/copy.svg" alt="Copy icon" width={24} height={24} />
                    <span>{copiedText}</span>
                  </button>
                  <button onClick={() => downloadTranscript(result)} className="w-full md:w-[140px] h-[35px] flex items-center justify-center gap-2 bg-[#EEB866FF] hover:bg-[#E79924FF] active:bg-[#CE8517FF] disabled:opacity-40 text-white font-opensans text-lg leading-7 rounded-lg transition-colors">
                    <Image src="/download.svg" alt="Download icon" width={24} height={24} />
                    <span>Download</span>
                  </button>
                  <button onClick={(e) => handleDownloadPDF(result)} className=" px-4 w-full md:w-[190px] h-[35px] flex items-center justify- gap-2 bg-[#EEB866FF] hover:bg-[#E79924FF] active:bg-[#CE8517FF] disabled:opacity-40 text-white font-opensans text-lg leading-7 rounded-lg transition-colors">
                    <Image src="/pdfIco.svg" alt="PDF icon" width={24} height={24} />
                    <span>Download PDF</span>
                  </button>
                </div>
                
                {/* Konten transkrip dan terjemahan */}
                <div className="w-full max-w-4xl mx-auto">
                  {result && (
                  <div className="flex flex-col md:flex-row items-center gap-2 mb-5 justify-center">
                    <LanguageSelect
                    value={selectedLanguage}
                    onValueChange={(value) => setSelectedLanguage(value)}
                    />
                    <button
                    onClick={handleTranslate}
                    disabled={isTranslating || isAiTraslate}
                    className="w-full md:w-[140px] h-[35px] flex items-center justify-center gap-2 bg-[#EEB866FF] hover:bg-[#E79924FF] active:bg-[#CE8517FF] disabled:opacity-40 text-white font-opensans text-lg leading-7 rounded-lg transition-colors"
                    >
                    <Image src="/language-translation-svgrepo-com.svg" alt="Translate icon" width={24} height={24} />
                    <span className="text-center">{isTranslating ? 'Translating' : 'Translate'}</span>
                    </button>
                    <button
                    onClick={handleAITranslate}
                    disabled={isAiTraslate || isTranslating}
                    className="w-full md:w-[140px] h-[35px] flex items-center justify-center gap-2 bg-[#EEB866FF] hover:bg-[#E79924FF] active:bg-[#CE8517FF] disabled:opacity-40 text-white font-opensans text-lg leading-7 rounded-lg transition-colors"
                    >
                    <Image src="/aiicon.png" alt="Translate icon" width={24} height={24} />
                    <span className="text-center">{isTranslating || isAiTraslate ? 'Translating' : 'AI Translate'}</span>
                    </button>
                  </div>
                  )}
                  {isTranslating ? (
                  <div className="flex flex-col items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mb-4"></div>
                    <p className="text-center text-lg">Translating your text...</p>
                    {isAiTraslate && <small className="text-gray-500 italic mt-4">AI translation is still in beta. Results may be inaccurate or take longer to process.</small>}

                  </div>
                  ) : (
                    <>
                    {erroTranslate ? (
                      <div className="flex flex-col gap-2">
                      <p className="text-red-500 text-center">Error when translating. Please try again later.</p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                      <p className="text-lg leading-relaxed">{result}</p>
                      {/* <small className="text-gray-500 italic">Note: AI translation may not be 100% accurate</small> */}
                      </div>
                    )}
                    </>
                  )}
                </div>
              </>
            ) : (
              <p className="text-center">No transcript available</p>
            )}
          </div>
        )}
      </div>
      <div className="mt-10 w-full max-w-4xl mx-auto px-4">
        <div className="container mx-auto max-w-[1024px]"></div>
            <h2 className="text-3xl font-bold mb-6 text-center">Getting to Know Transcribelt</h2>
          
          <div className="prose max-w-none">
        <p className="mb-6">
          Transcribelt is a practical tool for converting YouTube video content into easily accessible text. 
          With a responsive design and complete functionality, Transcribelt is suitable for various needs, 
          from taking notes to managing video content in text form.
        </p>

        <h3 className="text-2xl font-bold mt-8 mb-4 text-center">Key Features of Transcribelt</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="feature-card p-4 border rounded-lg transition-transform hover:scale-105 duration-300">
            <h4 className="font-bold mb-2 text-center">URL Input and Transcript Generation</h4>
            <ul className="list-disc pl-5">
          <li>Enter YouTube video URLs easily</li>
          <li>Automatic transcript generation</li>
          <li>Modern, interactive interface</li>
            </ul>
          </div>

          <div className="feature-card p-4 border rounded-lg transition-transform hover:scale-105 duration-300">
            <h4 className="font-bold mb-2 text-center">Integrated Video Player</h4>
            <ul className="list-disc pl-5">
          <li>Watch videos directly on page</li>
          <li>Responsive video player</li>
          <li>Seamless transcript verification</li>
            </ul>
          </div>

          <div className="feature-card p-4 border rounded-lg transition-transform hover:scale-105 duration-300">
            <h4 className="font-bold mb-2 text-center">Download Options</h4>
            <ul className="list-disc pl-5">
          <li>Download as text file</li>
          <li>Download as PDF</li>
          <li>Quick one-click copying</li>
            </ul>
          </div>

          <div className="feature-card p-4 border rounded-lg transition-transform hover:scale-105 duration-300">
            <h4 className="font-bold mb-2 text-center">Translation Features</h4>
            <ul className="list-disc pl-5">
          <li>Multi-language support</li>
          <li>AI-powered translation</li>
          <li>Real-time translation status</li>
            </ul>
          </div>
        </div>

        <h3 className="text-2xl font-bold mt-8 mb-4 text-center">Why Choose Transcribelt?</h3>
        <div className="flex flex-col gap-2 items-center">
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>All-in-one solution for video transcription</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>User-friendly interface with modern design</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>Multiple export options (Text, PDF)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>Integrated translation capabilities</span>
          </div>
        </div>
          </div>
        </div>
      </div>
  );
}
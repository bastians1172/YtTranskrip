"use client";
import { useState } from "react";
import getTranscript from "./getTranscript";
import { AiTranslate } from "./(utils)/groqApi/transplate";
import LanguageSelect from "./language";
import Image from "next/image";
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
  const handleGetTranscript = async (e: React.FormEvent<HTMLFormElement>) => {
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

  const handleTranslate = async () => {
    setResult("Translating... Please wait");
    setIsTranslating(true);
    try {
      const translatedText = await AiTranslate(originalTranscript, selectedLanguage);
      setResult(translatedText);
    } catch (error) {
      console.error("Error translating transcript:", error);
      setResult("Error translating transcript");
    }finally{
      setTimeout(() => {
        setIsTranslating(false);
      },9000)
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
    <div className="flex flex-col items-center min-h-screen font-roboto">
      <div className="flex flex-col items-center justify-center p-4 mt-10">
        <form
          onSubmit={handleGetTranscript}
          className="flex flex-col gap-10 justify-center items-center"
        >
            <label
            htmlFor="urlInput"
            className="w-[566px] font-inter text-3xl leading-relaxed font-bold text-center mb-4"
            >
            Enter YouTube URL for Transcript
            </label>
            <input
            id="urlInput"
            name="urlInput"
            type="text"
            placeholder="Enter YouTube URL (example: https://www.youtube.com/watch?v=...)"
            className="w-[604px] h-[44px] px-4 font-opensans text-base leading-[26px] bg-transparent 
              border border-[#BCC1CAFF] rounded-md
              hover:border-[#A7ADB7FF] hover:text-[#BCC1CAFF]
              focus:border-[#9095A0FF] focus:text-[#BCC1CAFF] 
              disabled:border-[#BCC1CAFF] disabled:text-[#BCC1CAFF]
              outline-none"
            value={url}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
            required
            />
          <button type="submit">
            <div className="w-[200px] h-[52px] px-5 flex items-center justify-center bg-[#EEB866FF] hover:bg-[#E79924FF] active:bg-[#CE8517FF] disabled:opacity-40 text-white font-opensans text-lg leading-7 rounded-lg transition-colors">
              Generate Transkrip
            </div>
          </button>
        </form>
      </div>

      <div className="mt-5 flex flex-row w-180 border-2 border-amber-500 rounded-lg p-4 gap-2">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="flex flex-col items-center gap-2 justify-center w-full">
            {result ? (
              <>
                <iframe
                  className="w-full h-[315px] rounded-lg border-0"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title="YouTube video player"
                />
                <div className="flex flex-row gap-2 my-5 mb-10">
                  <LanguageSelect
                    value={selectedLanguage}
                    onValueChange={(value) => setSelectedLanguage(value)}
                  />
                  <button
                    onClick={handleTranslate}
                    disabled={isTranslating}
                    className="w-[140px] h-[35px] flex items-center justify-center gap-2 bg-[#EEB866FF] hover:bg-[#E79924FF] active:bg-[#CE8517FF] disabled:opacity-40 text-white font-opensans text-lg leading-7 rounded-lg transition-colors"
                  >
                    <Image src="/aiicon.png" alt="Ai Icon"  width={24} height={24}/>
                    <span>{isTranslating ? 'Translating' : 'Translate'}</span>
                  </button>
                  <button onClick={handleCopy} className="flex items-center justify-center gap-3 w-[140px] bg-[#EEB866FF] hover:bg-[#E79924FF] active:bg-[#CE8517FF] disabled:opacity-40 text-white font-opensans text-lg leading-7 rounded-lg transition-colors">
                    <Image src="/copy.svg" alt="Copy icon" width={24} height={24} />
                    <span>{copiedText}</span>
                  </button>
                </div>
                <div>
                    <p className="">{result}</p>
                </div>
              </>
            ) : (
                <p>No transcript available</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
"use client";
import { useState } from "react";
import getTranscript from "./getTranscript";
import { main } from "./(utils)/groqApi/transplate";
import LanguageSelect from "./language";

// Fungsi untuk mengecek apakah URL valid
function checkUrl(url: string): boolean {
  return url.includes("youtube.com/watch?v=") || url.includes("youtu.be/");
}

// Fungsi untuk mengekstrak videoId dari URL YouTube
function extractVideoId(url: string): string | null {
  const regExp =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regExp);
  return match && match[1] ? match[1] : null;
}

// Fungsi untuk memformat waktu (dalam detik) ke format mm:ss
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en"); // Default bahasa Inggris

  const handleGetTranscript = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!checkUrl(url)) {
      setResult("Please enter a valid YouTube URL");
      return;
    }

    setLoading(true);
    try {
      const data = await getTranscript(url);
      setResult(data);
    } catch (error) {
      console.error("Error fetching transcript:", error);
      setResult("Error fetching transcript");
    } finally {
      setLoading(false);
    }
  };
  const videoId = extractVideoId(url);

  return (
    <div className="flex flex-col items-center min-h-screen font-roboto">
      <div className="flex flex-col items-center p-4 mt-10">
        <form
          onSubmit={handleGetTranscript}
          className="flex flex-col gap-10 justify-center items-center"
        >
          <label
            htmlFor="urlInput"
            className="w-[566px] font-inter text-[32px] leading-[48px] font-bold"
          >
            Enter Youtube URL for Transcription
          </label>

          <input
            id="urlInput"
            name="urlInput"
            type="text"
            placeholder="Enter YouTube URL (e.g., https://www.youtube.com/watch?v=...)"
            className="w-[604px] h-[44px] px-4 font-opensans text-base leading-[26px] bg-transparent 
                border border-[#BCC1CAFF] rounded-md
                hover:border-[#A7ADB7FF] hover:text-[#BCC1CAFF]
                focus:border-[#9095A0FF] focus:text-[#BCC1CAFF] 
                disabled:border-[#BCC1CAFF] disabled:text-[#BCC1CAFF]
                outline-none"
            value={url}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setUrl(e.target.value)
            }
            required
          />
          <button type="submit">
            <div className="w-[200px] h-[52px] px-5 flex items-center justify-center bg-[#EEB866FF] hover:bg-[#E79924FF] active:bg-[#CE8517FF] disabled:opacity-40 text-white font-opensans text-lg leading-7 rounded-lg transition-colors">
              Transcript
            </div>
          </button>
        </form>
      </div>

      <div className="mt-5 flex flex-row  w-120 border-2 border-amber-500 rounded-lg p-4 gap-2">
        {loading ? (
          <p>Loading...</p>
        ) : (
      <div className="flex flex-col items-center gap-2">
        {result ? (
          <>
            <iframe
            className="w-full h-[315px] rounded-lg"
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video player"
              frameBorder="0"
              // allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
            <div>
            <LanguageSelect value={selectedLanguage} onValueChange={setSelectedLanguage} />

            </div>
            <p>{result}</p>
          </>
        ) : (
          <p>No transcript yet</p>
        )}
      </div>
        )}
      </div>
    </div>
  );
}

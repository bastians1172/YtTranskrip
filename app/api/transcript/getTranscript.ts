"use server"
import { YtTranscript } from 'yt-transcript';
import he from 'he';

function extractVideoId(url: string): string | null {
  const regExp =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:shorts\/|[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regExp);
  return match && match[1] ? match[1] : null;
  }
export default async function getTranscript( videoUrl: string) {
    try {
      const transcriptId = extractVideoId(videoUrl);
      if (!transcriptId) {
        throw new Error('Invalid YouTube URL');
      }
      const ytTranscript = new YtTranscript({videoId: transcriptId});
      const result = await ytTranscript.getTranscript()
      let resultTrnaskirpt = ""
      if (!result) return "No transcript available";
      for (const item of result) {
        resultTrnaskirpt = resultTrnaskirpt +" "+item.text;
      }
      return he.decode(he.decode(resultTrnaskirpt));
    } catch (error) {
      console.error("Error fetching transcript:", error);
      return "No transcript available";
    }
}



  

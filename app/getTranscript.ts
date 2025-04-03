"use server"
import { log } from 'console';
import { YoutubeTranscript,YoutubeTranscriptNotAvailableLanguageError } from 'youtube-transcript';
import he from 'he';
export default async function getTranscript( videoUrl: string) {
    try {
      const transcript = (await YoutubeTranscript.fetchTranscript(videoUrl));
      let resultTrnaskirpt = ""
      for (const item of transcript) {
        resultTrnaskirpt = resultTrnaskirpt +" "+item.text;
      }
      return he.decode(he.decode(resultTrnaskirpt));
    } catch (error) {
      return "Error fetching transcript";
    }
}

import { parseYoutubeUrl } from "./youtube";
import type { TranscriptResult } from "@/lib/types/transcript";

/**
 * MVP stub: validates URL + extracts videoId, then returns placeholder transcript.
 * Ticket 003 will replace this with audio extraction + Whisper.
 */
export async function getTranscriptFromYoutubeUrl(url: string): Promise<{
  videoId: string;
  transcript: TranscriptResult;
}> {
  const { videoId } = parseYoutubeUrl(url);

  // Stubbed transcript output
  const transcript: TranscriptResult = {
    text: `Stub transcript for videoId=${videoId}. (Whisper integration comes next.)`,
    language: "en",
  };

  return { videoId, transcript };
}

import { extractAudioFromYoutubeUrl } from "./audio";
import { parseYoutubeUrl } from "./youtube";
import type { TranscriptResult } from "@/lib/types/transcript";

/**
 * Transcript still stubbed; Whisper comes next.
 */
export async function getTranscriptFromYoutubeUrl(url: string): Promise<{
  videoId: string;
  transcript: TranscriptResult;
  durationSec?: number;
}> {
  const { videoId } = parseYoutubeUrl(url);

  // Real audio extraction (produces ./var/audio/{videoId}.wav)
  const extracted = await extractAudioFromYoutubeUrl(url);

  // Stubbed transcript output (to be replaced by Whisper integration)
  const transcript: TranscriptResult = {
    text: `Stub transcript for videoId=${videoId}. (Whisper integration comes next.)`,
    language: "en",
  };

  return { videoId, transcript, durationSec: extracted.durationSec };
}

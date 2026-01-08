import { parseYoutubeUrl } from "./youtube";
import { extractAudio } from "./audio";
import type { TranscriptResult } from "@/lib/types/transcript";

/**
 * MVP stub:
 * - validates URL
 * - extracts videoId
 * - runs audio extraction stage (stubbed)
 * - returns placeholder transcript
 *
 * Whisper integration comes next.
 */
export async function getTranscriptFromYoutubeUrl(url: string): Promise<{
  videoId: string;
  transcript: TranscriptResult;
  durationSec?: number;
}> {
  const { videoId } = parseYoutubeUrl(url);

  // NEW: pipeline stage (stubbed audio extraction)
  const { durationSec } = await extractAudio(videoId);

  const transcript: TranscriptResult = {
    text: `Stub transcript for videoId=${videoId}. (Whisper integration comes next.)`,
    language: "en",
  };

  return { videoId, transcript, durationSec };
}

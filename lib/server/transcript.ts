import { extractAudioFromYoutubeUrl } from "./audio";
import type { TranscriptResult } from "@/lib/types/transcript";
import { transcribeAudioFileOpenAI } from "./transcription/openai";

export async function getTranscriptFromYoutubeUrl(url: string): Promise<{
  videoId: string;
  transcript: TranscriptResult;
  durationSec?: number;
}> {
  const extracted = await extractAudioFromYoutubeUrl(url);

  const t = await transcribeAudioFileOpenAI(extracted.audioPath);

  const transcript: TranscriptResult = {
    text: t.text,
    language: t.language,
  };

  return { videoId: extracted.videoId, transcript, durationSec: extracted.durationSec };
}

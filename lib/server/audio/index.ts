// lib/server/audio.ts

import { AudioExtractionError } from "./errors";
import type { ExtractAudioResult } from "./types";

const MAX_DURATION_SEC = 60 * 60; // 1 hour (stub policy boundary)

/**
 * Server-only pipeline stage: audio extraction.
 * Stub implementation: no real download, no yt-dlp, no ffmpeg.
 */
export async function extractAudio(videoId: string): Promise<ExtractAudioResult> {
  // Basic guard: videoId should be non-empty.
  // (In reality, validation happens earlier in youtube URL parsing.)
  if (!videoId || typeof videoId !== "string") {
    throw new AudioExtractionError(
      "UNSUPPORTED_VIDEO",
      "Missing or invalid video id."
    );
  }

  // ---- STUBBED FAILURE MODES (deterministic) ----
  // If videoId starts with "x" treat as unavailable (useful for testing).
  if (videoId.toLowerCase().startsWith("x")) {
    throw new AudioExtractionError(
      "UNAVAILABLE_VIDEO",
      "Video is unavailable or blocked."
    );
  }

  // Deterministic stub duration:
  // - If videoId ends with "Z" we pretend it is too long (to test the limit).
  // - Otherwise: 120 seconds.
  const durationSec = videoId.endsWith("Z") ? MAX_DURATION_SEC + 1 : 120;

  if (durationSec > MAX_DURATION_SEC) {
    throw new AudioExtractionError(
      "DURATION_LIMIT_EXCEEDED",
      `Video duration exceeds the maximum allowed length (${MAX_DURATION_SEC}s).`
    );
  }

  // Deterministic stub "audio source"
  return {
    audioSource: `stub://audio/${videoId}`,
    durationSec,
  };
}

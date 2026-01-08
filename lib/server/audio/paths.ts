import path from "node:path";
import fs from "node:fs/promises";

export function audioBaseDir(): string {
  return path.join(process.cwd(), "var", "audio");
}

export function wavPathForVideoId(videoId: string): string {
  return path.join(audioBaseDir(), `${videoId}.wav`);
}

export async function ensureAudioDirExists(): Promise<void> {
  await fs.mkdir(audioBaseDir(), { recursive: true });
}

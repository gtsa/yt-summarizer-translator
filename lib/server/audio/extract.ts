import fs from "node:fs/promises";
import fssync from "node:fs";
import path from "node:path";
import os from "node:os";

import { parseYoutubeUrl } from "../youtube";
import { AudioExtractionError } from "./errors";
import type { ExtractedAudio } from "./types";
import { ensureAudioDirExists, wavPathForVideoId } from "./paths";
import { downloadYoutubeAudioToTempFile } from "./ytdlp";
import { convertToWhisperWav } from "./ffmpeg";
import { probeDurationSec } from "./ffprobe";

const DEFAULT_MAX_DURATION_SEC = 20 * 60;

function getMaxVideoDurationSec(): number {
  const raw = process.env.MAX_VIDEO_DURATION_SEC;
  const parsed = raw ? Number(raw) : NaN;

  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed;
  }

  return DEFAULT_MAX_DURATION_SEC;
}

const MAX_DURATION_SEC = getMaxVideoDurationSec();

async function fileExistsNonEmpty(p: string): Promise<boolean> {
  try {
    const st = await fs.stat(p);
    return st.isFile() && st.size > 0;
  } catch {
    return false;
  }
}

function enforceMaxDuration(durationSec: number | undefined): void {
  if (typeof durationSec !== "number" || !Number.isFinite(durationSec)) return;

  if (durationSec > MAX_DURATION_SEC) {
    throw new AudioExtractionError(
      "VIDEO_TOO_LONG",
      `Video too long: ${Math.ceil(durationSec)}s (max ${MAX_DURATION_SEC}s)`,
      { details: { durationSec, maxDurationSec: MAX_DURATION_SEC } }
    );
  }
}

async function resolveDownloadedFile(workDir: string): Promise<string> {
  const entries = await fs.readdir(workDir);
  const match = entries.find((name) => name.startsWith("source."));
  if (!match) {
    throw new AudioExtractionError(
      "DOWNLOAD_FAILED",
      "yt-dlp succeeded but no source.* file was found",
      { details: { workDir, entries } }
    );
  }
  return path.join(workDir, match);
}

async function cleanupDirSafe(dir: string): Promise<void> {
  try {
    await fs.rm(dir, { recursive: true, force: true });
  } catch {
    // best effort
  }
}

export async function extractAudioFromYoutubeUrl(url: string): Promise<ExtractedAudio> {
  const { videoId } = parseYoutubeUrl(url);
  if (!videoId) {
    throw new AudioExtractionError("INVALID_INPUT", "Could not parse videoId from YouTube URL");
  }

  await ensureAudioDirExists();

  const outPath = wavPathForVideoId(videoId);

  // Cache hit
  if (await fileExistsNonEmpty(outPath)) {
    const durationSec = await probeDurationSec(outPath);
    enforceMaxDuration(durationSec);
    return { videoId, audioPath: outPath, durationSec, format: "wav" };
  }

  const workDir = await fs.mkdtemp(path.join(os.tmpdir(), "yt-audio-"));

  try {
    if (!fssync.existsSync(workDir)) {
      throw new AudioExtractionError("IO_FAILED", "Failed to create temp work directory");
    }

    await downloadYoutubeAudioToTempFile({ url, workDir });
    const downloaded = await resolveDownloadedFile(workDir);

    await convertToWhisperWav({ inputPath: downloaded, outputPath: outPath });

    if (!(await fileExistsNonEmpty(outPath))) {
      throw new AudioExtractionError(
        "CONVERT_FAILED",
        "ffmpeg reported success but output file is missing/empty",
        { details: { outPath } }
      );
    }

    const durationSec = await probeDurationSec(outPath);
    enforceMaxDuration(durationSec);

    return { videoId, audioPath: outPath, durationSec, format: "wav" };
  } catch (err: any) {
    // Remove partial output if created
    try {
      await fs.rm(outPath, { force: true });
    } catch {
      // ignore
    }

    if (err instanceof AudioExtractionError) throw err;

    const enoent =
      err?.code === "ENOENT" ||
      err?.cause?.code === "ENOENT" ||
      /command not found/i.test(String(err?.message ?? "")) ||
      /Failed to spawn/i.test(String(err?.message ?? ""));

    if (enoent) {
      throw new AudioExtractionError(
        "MISSING_DEP",
        "Missing dependency: yt-dlp and/or ffmpeg/ffprobe not found on PATH. Install them or set YTDLP_BIN/FFMPEG_BIN/FFPROBE_BIN.",
        { cause: err }
      );
    }

    throw new AudioExtractionError("IO_FAILED", "Unexpected audio extraction failure", { cause: err });
  } finally {
    await cleanupDirSafe(workDir);
  }
}

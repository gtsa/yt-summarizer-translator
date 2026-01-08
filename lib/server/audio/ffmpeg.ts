import { runCmd } from "./cmd";
import { AudioExtractionError } from "./errors";

export async function convertToWhisperWav(params: {
  inputPath: string;
  outputPath: string;
}): Promise<void> {
  const args = [
    "-y",                 // overwrite
    "-i",
    params.inputPath,
    "-ac",
    "1",                  // mono
    "-ar",
    "16000",              // 16kHz
    params.outputPath,
  ];

  const res = await runCmd("ffmpeg", args, { timeoutMs: 10 * 60_000 });

  if (res.code !== 0) {
    throw new AudioExtractionError("CONVERT_FAILED", "ffmpeg failed to convert audio", {
      details: { stderr: res.stderr, stdout: res.stdout, code: res.code },
    });
  }
}

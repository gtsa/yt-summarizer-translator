import { runCmd } from "./cmd";
import { AudioExtractionError } from "./errors";

export async function probeDurationSec(filePath: string): Promise<number> {
  const args = [
    "-v",
    "error",
    "-show_entries",
    "format=duration",
    "-of",
    "default=noprint_wrappers=1:nokey=1",
    filePath,
  ];

  const res = await runCmd("ffprobe", args, { timeoutMs: 60_000 });

  if (res.code !== 0) {
    throw new AudioExtractionError("PROBE_FAILED", "ffprobe failed to read duration", {
      details: { stderr: res.stderr, stdout: res.stdout, code: res.code },
    });
  }

  const value = Number(String(res.stdout).trim());
  if (!Number.isFinite(value) || value <= 0) {
    throw new AudioExtractionError("PROBE_FAILED", "ffprobe returned invalid duration", {
      details: { stdout: res.stdout },
    });
  }

  return value;
}

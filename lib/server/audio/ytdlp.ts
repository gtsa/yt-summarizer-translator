import path from "node:path";
import { runCmd } from "./cmd";
import { AudioExtractionError } from "./errors";

export async function downloadYoutubeAudioToTempFile(params: {
  url: string;
  workDir: string;
}): Promise<void> {
  const YTDLP_BIN = process.env.YTDLP_BIN ?? "yt-dlp";

  const outTemplate = path.join(params.workDir, "source.%(ext)s");
  const args = [
    "-f", "bestaudio/best",
    "--no-playlist",
    "-o", outTemplate,
    params.url,
  ];

  const res = await runCmd(YTDLP_BIN, args, { cwd: params.workDir, timeoutMs: 10 * 60_000 });

  if (res.code !== 0) {
    throw new AudioExtractionError("DOWNLOAD_FAILED", "yt-dlp failed to download audio", {
      details: { stderr: res.stderr, stdout: res.stdout, code: res.code },
    });
  }
}

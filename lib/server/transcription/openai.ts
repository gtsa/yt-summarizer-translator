import fs from "node:fs";
import { getOpenAIClient } from "@/lib/server/openai/client";

export type TranscriptionResult = {
  text: string;
  language?: string;
};

export type TranscriptionErrorKind =
  | "AUDIO_NOT_FOUND"
  | "OPENAI_AUTH"
  | "OPENAI_QUOTA"
  | "OPENAI_FAILED";

export class TranscriptionError extends Error {
  public readonly kind: TranscriptionErrorKind;
  public readonly status?: number;
  public readonly cause?: unknown;

  constructor(
    kind: TranscriptionErrorKind,
    message: string,
    opts?: { status?: number; cause?: unknown }
  ) {
    super(message);
    this.name = "TranscriptionError";
    this.kind = kind;
    this.status = opts?.status;
    this.cause = opts?.cause;
  }
}

const DEFAULT_MODEL = "gpt-4o-mini-transcribe";

export async function transcribeAudioFileOpenAI(
  audioFilePath: string,
  opts?: {
    model?: string;
    languageHint?: string;
  }
): Promise<TranscriptionResult> {
  const openai = getOpenAIClient();

  if (!fs.existsSync(audioFilePath)) {
    throw new TranscriptionError("AUDIO_NOT_FOUND", `Audio file not found: ${audioFilePath}`);
  }

  const model = opts?.model ?? process.env.OPENAI_TRANSCRIBE_MODEL ?? DEFAULT_MODEL;

  try {
    const res = await openai.audio.transcriptions.create({
      model,
      file: fs.createReadStream(audioFilePath),
      response_format: "json",
      temperature: 0,
      ...(opts?.languageHint ? { language: opts.languageHint } : {}),
    });

    return {
      text: (res as any).text ?? "",
      language: (res as any).language,
    };
  } catch (err: any) {
    const status = err?.status ?? err?.response?.status;
    const msg = err?.message ?? String(err);

    if (status === 401) {
      throw new TranscriptionError(
        "OPENAI_AUTH",
        "OpenAI authentication failed. Check OPENAI_API_KEY.",
        { status, cause: err }
      );
    }

    if (status === 429 && /quota|billing/i.test(msg)) {
      throw new TranscriptionError(
        "OPENAI_QUOTA",
        "OpenAI quota exceeded. Enable billing or increase your usage limit in the OpenAI dashboard.",
        { status, cause: err }
      );
    }

    throw new TranscriptionError(
      "OPENAI_FAILED",
      `OpenAI transcription failed (${model}): ${msg}`,
      { status, cause: err }
    );
  }
}

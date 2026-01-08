export type AudioErrorKind =
  | "MISSING_DEP"
  | "INVALID_INPUT"
  | "DOWNLOAD_FAILED"
  | "CONVERT_FAILED"
  | "PROBE_FAILED"
  | "IO_FAILED";

export class AudioExtractionError extends Error {
  public readonly kind: AudioErrorKind;
  public readonly cause?: unknown;
  public readonly details?: Record<string, unknown>;

  constructor(kind: AudioErrorKind, message: string, opts?: { cause?: unknown; details?: Record<string, unknown> }) {
    super(message);
    this.name = "AudioExtractionError";
    this.kind = kind;
    this.cause = opts?.cause;
    this.details = opts?.details;
  }
}

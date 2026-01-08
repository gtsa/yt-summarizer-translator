export type AudioExtractionErrorCode =
  | "UNSUPPORTED_VIDEO"
  | "UNAVAILABLE_VIDEO"
  | "DURATION_LIMIT_EXCEEDED";

export class AudioExtractionError extends Error {
  public readonly code: AudioExtractionErrorCode;

  constructor(code: AudioExtractionErrorCode, message: string) {
    super(message);
    this.name = "AudioExtractionError";
    this.code = code;
  }
}

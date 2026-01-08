export type ExtractAudioResult = {
  /**
   * In the real implementation this will likely become:
   * - a filesystem path (string), OR
   * - a Buffer, OR
   * - a stream handle (we're not doing streams in this stub).
   *
   * For the stub we return a deterministic "stub://" URI.
   */
  audioSource: string | Buffer;

  /**
   * Best-effort duration, used for enforcing limits and metadata.
   * In the stub we set it deterministically.
   */
  durationSec?: number;
};

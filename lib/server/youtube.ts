export class YoutubeUrlError extends Error {
  code = "INVALID_YOUTUBE_URL" as const;
}

type ParseResult = { videoId: string };

const VIDEO_ID_RE = /^[a-zA-Z0-9_-]{11}$/;

function assertValidId(id: string | null | undefined): string {
  if (!id) throw new YoutubeUrlError("Missing video id.");
  // Some URLs may include extra stuff; keep it strict and predictable.
  const clean = id.trim();
  if (!VIDEO_ID_RE.test(clean)) throw new YoutubeUrlError("Invalid video id.");
  return clean;
}

function normalizeInputToUrlString(inputRaw: string): string {
  const input = inputRaw.trim();

  // 1) Raw video ID
  if (VIDEO_ID_RE.test(input)) return `https://www.youtube.com/watch?v=${input}`;

  // 2) If it already has a scheme, keep it
  if (/^https?:\/\//i.test(input)) return input;

  // 3) Domain/path without scheme
  //    e.g. youtube.com/watch?v=..., www.youtube.com/..., youtu.be/...
  if (/^(www\.)?(youtube\.com|m\.youtube\.com|youtu\.be)\b/i.test(input)) {
    return `https://${input}`;
  }

  throw new YoutubeUrlError("Invalid URL.");
}

export function parseYoutubeUrl(input: string): ParseResult {
  let url: URL;
  try {
    url = new URL(normalizeInputToUrlString(input));
  } catch {
    throw new YoutubeUrlError("Invalid URL.");
  }

  const host = url.hostname.replace(/^www\./, "");

  // youtu.be/<id>
  if (host === "youtu.be") {
    const id = url.pathname.split("/").filter(Boolean)[0];
    return { videoId: assertValidId(id) };
  }

  // youtube.com / m.youtube.com
  if (host === "youtube.com" || host === "m.youtube.com") {
    // youtube.com/watch?v=<id>
    if (url.pathname === "/watch") {
      return { videoId: assertValidId(url.searchParams.get("v")) };
    }

    const parts = url.pathname.split("/").filter(Boolean);

    // youtube.com/shorts/<id>
    if (parts[0] === "shorts" && parts[1]) return { videoId: assertValidId(parts[1]) };

    // youtube.com/embed/<id>
    if (parts[0] === "embed" && parts[1]) return { videoId: assertValidId(parts[1]) };
  }

  throw new YoutubeUrlError("Not a supported YouTube URL format.");
}

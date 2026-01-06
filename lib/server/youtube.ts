export class YoutubeUrlError extends Error {
  code = "INVALID_YOUTUBE_URL" as const;
}

type ParseResult = { videoId: string };

export function parseYoutubeUrl(input: string): ParseResult {
  let url: URL;
  try {
    url = new URL(input);
  } catch {
    throw new YoutubeUrlError("Invalid URL.");
  }

  const host = url.hostname.replace(/^www\./, "");

  // youtu.be/<id>
  if (host === "youtu.be") {
    const id = url.pathname.split("/").filter(Boolean)[0];
    if (!id) throw new YoutubeUrlError("Missing video id.");
    return { videoId: id };
  }

  // youtube.com/watch?v=<id>
  if (host === "youtube.com" || host === "m.youtube.com") {
    const isWatch = url.pathname === "/watch";
    if (isWatch) {
      const id = url.searchParams.get("v");
      if (!id) throw new YoutubeUrlError("Missing v parameter.");
      return { videoId: id };
    }

    // youtube.com/shorts/<id>
    const parts = url.pathname.split("/").filter(Boolean);
    if (parts[0] === "shorts" && parts[1]) return { videoId: parts[1] };

    // youtube.com/embed/<id>
    if (parts[0] === "embed" && parts[1]) return { videoId: parts[1] };
  }

  throw new YoutubeUrlError("Not a supported YouTube URL format.");
}

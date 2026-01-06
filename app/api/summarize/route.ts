import { NextResponse } from "next/server";
import { z } from "zod";
import { SummarizeRequestSchema } from "@/lib/types/api";
import { getTranscriptFromYoutubeUrl } from "@/lib/server/transcript";
import { YoutubeUrlError } from "@/lib/server/youtube";

export const runtime = "nodejs"; // important later for yt-dlp/ffmpeg

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = SummarizeRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: {
            code: "BAD_REQUEST",
            message: "Expected JSON body: { url: string }",
          },
        },
        { status: 400 }
      );
    }

    const { url } = parsed.data;
    const { videoId, transcript } = await getTranscriptFromYoutubeUrl(url);

    return NextResponse.json(
      {
        transcript,
        metadata: { videoId },
      },
      { status: 200 }
    );
  } catch (err) {
    // Known validation errors
    if (err instanceof YoutubeUrlError) {
      return NextResponse.json(
        { error: { code: err.code, message: err.message } },
        { status: 400 }
      );
    }

    // Zod parsing errors (if any)
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: { code: "BAD_REQUEST", message: "Invalid request." } },
        { status: 400 }
      );
    }

    console.error("Unhandled error in /api/summarize:", err);

    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Something went wrong." } },
      { status: 500 }
    );
  }
}

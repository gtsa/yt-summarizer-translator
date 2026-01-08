"use client";

import { useState } from "react";

type ApiResponse =
  | {
      transcript?: { text: string; language?: string };
      metadata?: { videoId: string; durationSec?: number };
    }
  | { error: { code: string; message: string } };

export default function Page() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState<ApiResponse | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setRes(null);

    const r = await fetch("/api/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    const data = (await r.json().catch(() => ({}))) as ApiResponse;
    setRes(data);
    setLoading(false);
  }

  return (
    <main className="mx-auto max-w-2xl p-6 space-y-6">
      <h1 className="text-2xl font-semibold">YouTube Summariser & Translator</h1>

      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="w-full rounded-md border px-3 py-2"
          placeholder="Paste a YouTube URL…"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          className="rounded-md border px-4 py-2"
          disabled={loading || !url.trim()}
          type="submit"
        >
          {loading ? "Working…" : "Get transcript (stub)"}
        </button>
      </form>

      {res && "error" in res && (
        <div className="rounded-md border p-4">
          <div className="font-medium">Error: {res.error.code}</div>
          <div className="text-sm">{res.error.message}</div>
        </div>
      )}

      {res && "transcript" in res && res.transcript && (
        <div className="rounded-md border p-4 space-y-2">
          <div className="text-sm text-muted-foreground">
            videoId: {res.metadata?.videoId} · lang: {res.transcript.language ?? "?"} · duration: {res.metadata?.durationSec ?? "?"}s
          </div>
          <pre className="whitespace-pre-wrap text-sm">{res.transcript.text}</pre>
        </div>
      )}
    </main>
  );
}

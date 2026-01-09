"use client";

import { useState, type FormEvent } from "react";

type LayoutMode = "tabs" | "split" | "accordion";

type ApiResponse =
  | {
      transcript?: { text: string; language?: string };
      metadata?: { videoId: string; durationSec?: number };
      error?: never;
    }
  | { error: { code: string; message: string } };

function truncate(text: string, max = 500) {
  if (text.length <= max) return text;
  return text.slice(0, max) + "…";
}

const GREEK_PLACEHOLDER =
  "Εδώ θα εμφανίζεται η ελληνική μετάφραση του περιεχομένου, μόλις ολοκληρωθεί η επόμενη φάση του προϊόντος.";

export default function Home() {
  const [url, setUrl] = useState("");
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("tabs");
  const [activeTab, setActiveTab] = useState<"summary" | "greek">("summary");

  // API result state
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Summary preview (500 chars)
  const [previewText, setPreviewText] = useState<string>("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setApiError(null);
    setPreviewText("");

    const input = url.trim();
    if (!input) {
      setApiError("Please paste a YouTube URL or a video ID.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url: input }), // send raw input; server parser is source of truth
      });

      const data = (await res.json()) as ApiResponse;

      if (!res.ok || "error" in data) {
        const msg = "error" in data ? data.error.message : "Request failed.";
        setApiError(msg);
        return;
      }

      const text = data.transcript?.text ?? "";
      setPreviewText(truncate(text, 500));

    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">YouTube Summarizer & Translator</h1>
          <p className="text-muted-foreground">
            Showing first 500 characters of the transcript for now.
          </p>
        </header>

        <section className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="youtube-url" className="block text-sm font-medium text-card-foreground">
                  YouTube URL (or video ID)
                </label>
                <input
                  id="youtube-url"
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-card-foreground">Layout:</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setLayoutMode("tabs")}
                      className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                        layoutMode === "tabs"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground hover:bg-muted/80"
                      }`}
                    >
                      Tabs
                    </button>
                    <button
                      type="button"
                      onClick={() => setLayoutMode("split")}
                      className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                        layoutMode === "split"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground hover:bg-muted/80"
                      }`}
                    >
                      Split
                    </button>
                    <button
                      type="button"
                      onClick={() => setLayoutMode("accordion")}
                      className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                        layoutMode === "accordion"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground hover:bg-muted/80"
                      }`}
                    >
                      Accordion
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
                >
                  {loading ? "Transcribing…" : "Transcribe"}
                </button>
              </div>
            </form>

          </div>
        </section>

        <section className="space-y-4">
          {!previewText ? (
            <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
              {loading ? "Working…" : "Submit a YouTube URL/video ID to preview the transcript in the UI panels."}
            </div>
          ) : (
            <>
              {layoutMode === "tabs" && (
                <div className="space-y-4">
                  <div className="flex gap-4 border-b border-border">
                    <button
                      onClick={() => setActiveTab("summary")}
                      className={`px-4 py-2 text-sm font-medium transition-colors ${
                        activeTab === "summary"
                          ? "border-b-2 border-primary text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Summary
                    </button>
                    <button
                      onClick={() => setActiveTab("greek")}
                      className={`px-4 py-2 text-sm font-medium transition-colors ${
                        activeTab === "greek"
                          ? "border-b-2 border-primary text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Greek Translation
                    </button>
                  </div>

                  <div className="rounded-lg border border-border bg-card p-6">
                    {activeTab === "summary" ? (
                      <TextPanel heading="Summary (temporary)" text={previewText} />
                    ) : (
                      <TextPanel heading="Greek Translation (coming soon)" text={GREEK_PLACEHOLDER} />
                    )}
                  </div>
                </div>
              )}

              {layoutMode === "split" && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border border-border bg-card p-6">
                    <TextPanel heading="Summary (temporary)" text={previewText} />
                  </div>
                  <div className="rounded-lg border border-border bg-card p-6">
                    <TextPanel heading="Greek Translation (coming soon)" text={GREEK_PLACEHOLDER} />
                  </div>
                </div>
              )}

              {layoutMode === "accordion" && (
                <div className="space-y-4">
                  <details className="rounded-lg border border-border bg-card p-6" open>
                    <summary className="cursor-pointer text-sm font-medium text-foreground">Summary (temporary)</summary>
                    <div className="mt-4">
                      <TextPanel heading={null} text={previewText} />
                    </div>
                  </details>

                  <details className="rounded-lg border border-border bg-card p-6">
                    <summary className="cursor-pointer text-sm font-medium text-foreground">
                      Greek Translation (coming soon)
                    </summary>
                    <div className="mt-4">
                      <TextPanel heading={null} text={GREEK_PLACEHOLDER} />
                    </div>
                  </details>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}

function TextPanel({ heading, text }: { heading: string | null; text: string }) {
  return (
    <div className="space-y-3 text-card-foreground">
      {heading && <h3 className="text-sm font-semibold">{heading}</h3>}
      <pre className="whitespace-pre-wrap break-words rounded-md bg-muted p-4 text-sm leading-relaxed text-foreground">
        {text}
      </pre>
      <p className="text-xs text-muted-foreground">Showing first 500 characters. (Summary/Translation not implemented yet.)</p>
    </div>
  );
}

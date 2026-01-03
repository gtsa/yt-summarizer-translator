"use client"

import { useState, type FormEvent } from "react"

type LayoutMode = "tabs" | "split" | "accordion"

export default function Home() {
  const [url, setUrl] = useState("")
  const [parsedData, setParsedData] = useState<{
    rawInput: string
    normalizedUrl: string | null
    error: string | null
    hostname: string | null
    videoId: string | null
  } | null>(null)
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("tabs")
  const [activeTab, setActiveTab] = useState<"summary" | "greek">("summary")
  const [accordionOpen, setAccordionOpen] = useState<{
    summary: boolean
    greek: boolean
  }>({ summary: true, greek: false })

  const parseYouTubeUrl = (input: string) => {
    const rawInput = input
    let normalizedUrl: string | null = null
    let error: string | null = null
    let hostname: string | null = null
    let videoId: string | null = null

    try {
      // Try to parse as URL
      const urlObj = new URL(input)
      normalizedUrl = urlObj.href
      hostname = urlObj.hostname

      // Extract video ID from various YouTube URL formats
      if (hostname.includes("youtube.com")) {
        // watch?v= format
        const vParam = urlObj.searchParams.get("v")
        if (vParam) {
          videoId = vParam
        }
        // /embed/ format
        else if (urlObj.pathname.includes("/embed/")) {
          videoId = urlObj.pathname.split("/embed/")[1]?.split("?")[0] || null
        }
        // /shorts/ format
        else if (urlObj.pathname.includes("/shorts/")) {
          videoId = urlObj.pathname.split("/shorts/")[1]?.split("?")[0] || null
        }
        // /live/ format
        else if (urlObj.pathname.includes("/live/")) {
          videoId = urlObj.pathname.split("/live/")[1]?.split("?")[0] || null
        }
      } else if (hostname.includes("youtu.be")) {
        // youtu.be/ short format
        videoId = urlObj.pathname.split("/")[1]?.split("?")[0] || null
      }
    } catch {
      error = "Invalid URL format"
    }

    return { rawInput, normalizedUrl, error, hostname, videoId }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const result = parseYouTubeUrl(url)
    setParsedData(result)
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header */}
        <header className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">YouTube Summarizer & Translator</h1>
          <p className="text-muted-foreground">Enter a YouTube URL to parse and preview the UI</p>
        </header>

        {/* Input Section */}
        <section className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="youtube-url" className="block text-sm font-medium text-card-foreground">
                  YouTube URL
                </label>
                <input
                  id="youtube-url"
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full rounded-md border border-input bg-background px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSubmit(e)
                    }
                  }}
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring md:w-auto"
              >
                Test input
              </button>
            </form>
          </div>
        </section>

        {/* Parsed Output Section */}
        {parsedData && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Parsed Output</h2>
            <div className="rounded-lg border border-border bg-card p-6">
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Raw Input</dt>
                  <dd className="mt-1 break-all text-sm text-card-foreground">{parsedData.rawInput}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Normalized URL</dt>
                  <dd className="mt-1 break-all text-sm text-card-foreground">
                    {parsedData.error ? (
                      <span className="text-destructive">{parsedData.error}</span>
                    ) : (
                      parsedData.normalizedUrl
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Hostname</dt>
                  <dd className="mt-1 text-sm text-card-foreground">{parsedData.hostname || "N/A"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Video ID</dt>
                  <dd className="mt-1 text-sm text-card-foreground">
                    {parsedData.videoId ? (
                      <code className="rounded bg-muted px-2 py-1 font-mono">{parsedData.videoId}</code>
                    ) : (
                      "N/A"
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          </section>
        )}

        {/* Layout Mode Selector */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Results Preview</h2>
            <div className="flex gap-1 rounded-md border border-border bg-muted p-1">
              <button
                onClick={() => setLayoutMode("tabs")}
                className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
                  layoutMode === "tabs"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Tabs
              </button>
              <button
                onClick={() => setLayoutMode("split")}
                className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
                  layoutMode === "split"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Split
              </button>
              <button
                onClick={() => setLayoutMode("accordion")}
                className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
                  layoutMode === "accordion"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Accordion
              </button>
            </div>
          </div>

          {/* Tabs Layout */}
          {layoutMode === "tabs" && (
            <div className="space-y-4">
              <div className="flex gap-2 border-b border-border">
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
                {activeTab === "summary" ? <SummaryContent /> : <GreekContent />}
              </div>
            </div>
          )}

          {/* Split Layout */}
          {layoutMode === "split" && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="mb-4 text-lg font-semibold text-card-foreground">Summary</h3>
                <SummaryContent />
              </div>
              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="mb-4 text-lg font-semibold text-card-foreground">Greek Translation</h3>
                <GreekContent />
              </div>
            </div>
          )}

          {/* Accordion Layout */}
          {layoutMode === "accordion" && (
            <div className="space-y-2">
              <div className="rounded-lg border border-border bg-card">
                <button
                  onClick={() => setAccordionOpen((prev) => ({ ...prev, summary: !prev.summary }))}
                  className="flex w-full items-center justify-between p-4 text-left font-semibold text-card-foreground hover:bg-accent/50 transition-colors"
                >
                  <span>Summary</span>
                  <svg
                    className={`h-5 w-5 transition-transform ${accordionOpen.summary ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {accordionOpen.summary && (
                  <div className="border-t border-border p-6">
                    <SummaryContent />
                  </div>
                )}
              </div>
              <div className="rounded-lg border border-border bg-card">
                <button
                  onClick={() => setAccordionOpen((prev) => ({ ...prev, greek: !prev.greek }))}
                  className="flex w-full items-center justify-between p-4 text-left font-semibold text-card-foreground hover:bg-accent/50 transition-colors"
                >
                  <span>Greek Translation</span>
                  <svg
                    className={`h-5 w-5 transition-transform ${accordionOpen.greek ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {accordionOpen.greek && (
                  <div className="border-t border-border p-6">
                    <GreekContent />
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

function SummaryContent() {
  return (
    <div className="space-y-4 text-card-foreground">
      <p className="leading-relaxed">
        This is a placeholder summary of the YouTube video. In the actual implementation, this section would contain the
        AI-generated summary of the video content, providing viewers with a quick overview of the main topics and key
        points discussed.
      </p>
      <p className="leading-relaxed">
        The summary would be generated using Whisper for transcription and OpenAI for summarization, extracting the most
        important information from the video in a concise format.
      </p>
      <div className="mt-4">
        <h4 className="mb-2 font-semibold">Key Points:</h4>
        <ul className="ml-6 list-disc space-y-1 text-sm">
          <li>First major topic discussed in the video</li>
          <li>Second important concept or idea</li>
          <li>Third key takeaway or conclusion</li>
          <li>Additional insights and observations</li>
        </ul>
      </div>
    </div>
  )
}

function GreekContent() {
  return (
    <div className="space-y-4 text-card-foreground">
      <p className="leading-relaxed">
        Αυτή είναι μια υποκατάστατη ελληνική μετάφραση της περίληψης του βίντεο του YouTube. Στην πραγματική υλοποίηση,
        αυτή η ενότητα θα περιείχε την ελληνική μετάφραση της περίληψης που δημιουργήθηκε από την τεχνητή νοημοσύνη.
      </p>
      <p className="leading-relaxed">
        Η μετάφραση θα παρείχε στους ελληνόφωνους χρήστες πρόσβαση στο περιεχόμενο του βίντεο στη μητρική τους γλώσσα,
        διευκολύνοντας την κατανόηση και την πρόσβαση στην πληροφορία.
      </p>
      <div className="mt-4">
        <h4 className="mb-2 font-semibold">Κύρια Σημεία:</h4>
        <ul className="ml-6 list-disc space-y-1 text-sm">
          <li>Πρώτο σημαντικό θέμα που συζητήθηκε στο βίδεο</li>
          <li>Δεύτερη σημαντική έννοια ή ιδέα</li>
          <li>Τρίτο βασικό συμπέρασμα</li>
          <li>Πρόσθετες ιδέες και παρατηρήσεις</li>
        </ul>
      </div>
    </div>
  )
}

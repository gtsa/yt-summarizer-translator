# Roadmap

This project has two phases:

- **Phase 1: MVP** — build the core YouTube → Whisper transcription → summary → translation pipeline end-to-end.
- **Phase 2: Future extensions** — additional analysis modes, additional input types, and additional platforms (optional).

The documentation is written so that a future reader (including an AI agent) can understand:
- what is in scope now
- what is postponed
- why each decision was made

---

## Phase 1 — MVP (Build now)

### Definition of the MVP
A user can paste a YouTube URL on mobile or desktop and reliably receive:
- a concise summary
- key takeaways
- a Greek translation

The system should work even when YouTube captions are missing or unavailable,
because transcription is done via Whisper.

---

## Phase 1 — MVP Tasks (Checklist)

### A) Input & validation
- [ ] Accept a YouTube URL
- [ ] Validate input + extract video ID

### B) Audio extraction
- [ ] Obtain an audio stream/source for the video (implementation detail)
- [ ] Handle common failure cases (unavailable, blocked, unsupported)

### C) Transcription (primary strategy)
- [ ] Run **Whisper transcription** on extracted audio
- [ ] Capture transcript text + language metadata (best-effort)
- [ ] Timeouts / max duration safeguards (avoid runaway compute)

**Note:** Captions are NOT required for MVP.

### D) Transcript preparation
- [ ] Clean + normalise transcript text
- [ ] Handle long transcripts:
  - [ ] chunk safely for LLM context limits
  - [ ] preserve order and continuity

### E) Summarisation & key points
- [ ] LLM summarisation output:
  - [ ] concise summary
  - [ ] key takeaways (bullet points)
- [ ] Merge chunk summaries into final result (if chunking used)
- [ ] Guardrails:
  - [ ] avoid claims of factual verification
  - [ ] keep outputs focused on the transcript

### F) Translation
- [ ] Translate summary and/or key points to Greek (default)
- [ ] Keep translation as a separate step (clean separation of concerns)

### G) Backend API
- [ ] One endpoint that runs the pipeline (URL → results)
- [ ] Clear response schema:
  - summary
  - key_points
  - translation_el
  - metadata (language, durations, etc.)
- [ ] Clear errors:
  - invalid URL
  - audio extraction failure
  - transcription failure
  - LLM provider failure

### H) Web app + PWA (mobile-first)
- [ ] Responsive UI (mobile-first)
- [ ] Loading + error states
- [ ] Results view:
  - summary
  - key points
  - Greek translation
- [ ] PWA setup (installable)

### I) Deployment (basic)
- [ ] Docker-based local run
- [ ] Simple deploy instructions

---

## Phase 2 — Future extensions (Optional, explicitly postponed)

### Smarter analysis (only when appropriate)
- [ ] Devil’s advocate / counter-arguments mode
  - enable only for content types where “arguments” make sense (debate/commentary)
  - disable for recipes/tutorials/music/etc. with a clear explanation

### More input types
- [ ] Screenshot / image text (OCR → same pipeline)
- [ ] Paste text directly
- [ ] Webpage URL → extract readable text → summarise/translate
- [ ] Email text → summarise/translate

### Captions optimisation (optional)
- [ ] If captions are available and retrievable, use them to:
  - reduce cost
  - speed up responses
  - improve transcription accuracy
But the system must still work without captions.

### Platforms / distribution
- [ ] Android app (wrapper)
- [ ] iOS app (wrapper)
- [ ] Chrome/Chromium extension
- [ ] “Share to app” flow on mobile

### UX improvements
- [ ] Language selector (beyond Greek)
- [ ] Summary length selector (short/medium)
- [ ] Local history
- [ ] Caching per video
- [ ] Accessibility polish

### Other ideas
- [ ] Keep an “Ideas” section or issues list for anything new that comes up


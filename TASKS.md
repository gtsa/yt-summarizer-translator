# Tasks — MVP

## Repo scaffolding
- [ ] Backend project skeleton (Node.js + TypeScript)
- [ ] Frontend project skeleton (React + Vite)
- [ ] Shared types/interfaces
- [ ] Docker setup for local development

---

## Backend — Core pipeline

### Input & validation
- [ ] Accept YouTube URL
- [ ] Validate URL
- [ ] Extract video ID

### Audio extraction
- [ ] Extract audio stream from video
- [ ] Handle common failure cases
- [ ] Enforce duration/size limits

### Transcription
- [ ] Run Whisper transcription
- [ ] Capture transcript text
- [ ] Capture detected language (best effort)

### Transcript preparation
- [ ] Clean and normalise text
- [ ] Chunk long transcripts safely
- [ ] Preserve order across chunks

### Summarisation
- [ ] Generate concise summary
- [ ] Generate key points (bullet list)
- [ ] Merge chunk-level results

### Translation
- [ ] Translate summary/key points to Greek
- [ ] Keep translation step separate

---

## Backend — API
- [ ] POST endpoint running full pipeline
- [ ] Stable response schema
- [ ] Clear error responses
- [ ] Logging per stage

---

## Frontend — Web app & PWA
- [ ] Mobile-first layout
- [ ] URL input
- [ ] Loading state
- [ ] Error display
- [ ] Results display:
  - summary
  - key points
  - Greek translation
- [ ] PWA manifest + service worker

---

## CLI (optional)
- [ ] CLI command that calls API
- [ ] Text output
- [ ] JSON output option


# Project Context (Frozen Decisions)

## Project name
YouTube Summariser & Translator

## One-line goal
Paste a YouTube URL → Whisper transcription → summary + key points → Greek translation,
delivered via an API, a mobile-first web app, and a PWA.

---

## Why this project exists
This project automates a real, repeated workflow:
turning long-form YouTube videos into something readable and shareable.

The emphasis is on:
- robustness
- predictability
- clear scope
- realistic AI usage

---

## MVP scope (what MUST exist)

### Input
- YouTube video URL

### Core pipeline
1. Extract audio from the video
2. Transcribe audio using **Whisper** (primary strategy)
3. Clean and normalise transcript text
4. Summarise transcript
5. Extract key points
6. Translate results to Greek

### Delivery
- Backend API that runs the full pipeline
- Web app (responsive, mobile-first)
- Installable PWA
- Optional CLI that calls the API (thin client)

---

## Explicit non-goals (MVP)
The following are intentionally excluded from the MVP:

- Devil’s advocate / counter-arguments
- OCR (screenshots / images)
- Webpage summarisation
- Email text summarisation
- Arbitrary pasted text
- Browser extensions
- Android/iOS native apps
- Authentication, accounts, payments
- Agent systems or workflow builders

These are tracked separately as future ideas.

---

## Key architectural decisions
- Whisper is the **primary transcription method**
- Single-repo monolith
- One core pipeline reused by all clients
- AI used only for tasks where it is robust (summarisation, translation)
- Fail clearly rather than silently

---

## Open questions (intentionally unresolved)
- Exact audio extraction method
- Whisper deployment strategy (local vs API)
- Hosting environment for MVP

---

## References
- README.md — high-level description
- ROADMAP.md — planned work
- DECISIONS.md — rationale for key choices


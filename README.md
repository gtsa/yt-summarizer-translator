# YouTube Summariser & Translator

A lightweight, mobile-first web app (PWA) that takes a YouTube video URL and generates:
- a concise summary
- key takeaways (bullet points)
- a translation (Greek first)

This project exists to automate a real everyday workflow: turning long-form video content into something readable and shareable.

---

## MVP: What it does (end-to-end)

Given a YouTube URL, the MVP pipeline is:

1) **Extract audio**
2) **Transcribe audio using Whisper** (primary strategy)
3) **Clean / normalise transcript text**
4) **Summarise + extract key points**
5) **Translate to Greek**
6) Return results via:
   - **Backend API**
   - **Web App (mobile-first)**
   - **PWA** (installable)

The key design choice is that transcription is owned by the application (Whisper),
so the tool does **not depend on YouTube captions being present or retrievable**.

---

## Why Whisper is the MVP strategy (important)

YouTube transcripts/captions are not reliably available or retrievable for all videos.
Even when captions exist, access can be fragile, rate-limited, or blocked depending on environment.

Therefore:

- **Whisper is the primary method** for consistent coverage.
- Captions can be considered a future optimisation (optional), not a dependency.

---

## What the MVP intentionally does NOT include

The MVP excludes (tracked in `ROADMAP.md`):
- Devil’s advocate / counter-arguments mode
- Screenshot/image OCR
- Webpage summarisation
- Email text summarisation
- Pasted text input
- Browser extensions
- Android/iOS app packaging
- Accounts / auth / payments
- Heavy “agent” workflows

The MVP goal is one robust pipeline, done well.

---

## AI robustness (design principle)

LLMs are used only for tasks where they are typically reliable:
- summarisation
- translation
- key point extraction

The app does **not** rely on LLMs for:
- math / counting
- factual verification
- strict logical correctness

---

## Project status

🚧 Starting with MVP

See `ROADMAP.md` for the plan, future extensions, and design decisions.

---

## License

Non-commercial. See `LICENSE`.
Commercial use is not permitted without explicit permission from the author.

---

## Author

George Tsagiannis


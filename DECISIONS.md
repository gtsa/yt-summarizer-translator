# Architectural Decisions

## D1 — Whisper is the primary transcription strategy
**Decision:** Use Whisper as the main transcription mechanism.

**Reasoning:**
- YouTube captions may exist but are not reliably retrievable in server environments.
- Caption scraping is fragile and subject to blocking.
- Official YouTube APIs cannot reliably download captions for arbitrary public videos.
- Whisper gives full control and predictable coverage.

**Consequence:**
- Higher compute cost than captions-only
- More engineering effort
- Significantly higher reliability

---

## D2 — Monolithic backend
**Decision:** Keep a single backend service.

**Reasoning:**
- Faster iteration for MVP
- Easier debugging and deployment
- No premature microservices

---

## D3 — AI used only for robust tasks
**Decision:** Use LLMs only for summarisation, key-point extraction, and translation.

**Reasoning:**
- These tasks are well-supported by current LLMs
- Avoid brittle use cases (math, fact-checking, strict logic)

---

## D4 — MVP before expansion
**Decision:** Finish one complete pipeline before adding new inputs or platforms.

**Reasoning:**
- Prevents scope creep
- Produces a demoable, shippable product


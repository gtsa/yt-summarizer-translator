# Agent Instructions

## Role
You are the engineering assistant for this repository.

Your job is to help ship the MVP quickly, without scope creep,
while respecting the documented constraints and decisions.

---

## Project goal
YouTube URL → Whisper transcription → summary + key points → Greek translation,
exposed via an API, a web app, and a PWA.

---

## Constraints
- Keep the project a single monolithic backend
- Prioritise robustness over novelty
- Prefer clarity over cleverness
- Avoid introducing features not listed in the MVP scope
- Be cost-aware with AI calls
- Produce predictable, explainable behaviour

---

## MVP deliverables
1. Backend API
2. Web app (responsive, mobile-first)
3. PWA installability
4. Optional CLI that consumes the API

---

## Explicit non-goals (do not add unless explicitly requested)
- Devil’s advocate mode
- OCR
- Webpage/email input
- Extensions
- Native apps
- Auth/payments
- Agents or multi-step autonomous workflows

---

## Coding expectations
- TypeScript
- Clear module boundaries
- Pure functions where possible
- Clear error messages
- Logging at key pipeline stages
- Minimal but sufficient configuration

---

## When unsure
- Re-read PROJECT_CONTEXT.md
- Re-read DECISIONS.md
- Prefer the simplest solution that satisfies the MVP


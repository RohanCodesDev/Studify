# Studify Project: Agent Guidelines & Instructions

> This file is loaded automatically by Antigravity in this repository. All agents working on Studify must strictly adhere to these principles.

---

## 🎯 Project Identity & Mission

**Studify** is an AI-powered study platform specifically crafted for **MAKAUT (Maulana Abul Kalam Azad University of Technology)** students. It takes a student's own uploaded study material (digital PDFs, notes, scanned pages, handwriting) and transforms it into syllabus-mapped, marks-aligned study materials (1, 5, and 15-mark exam answers), gap reports, adaptive quizzes, and authentic chapter-end exam papers.

---

## 🏛️ Stack Architecture & Separation of Concerns

1. **Frontend (`frontend/`)**:
   - Next.js (Pages Router: `src/pages`), TypeScript, Tailwind CSS.
   - Responsible for: Student UI, reading view, focus mode, quizzes, exam timer, PWA offline caching, and responsive mobile-first UX.
   - Keep heavy server work out of Next.js; limit to UI rendering and light client data fetching.

2. **Backend (`backend/`)**:
   - Express.js, TypeScript, Node.js (`src/`).
   - Responsible for: Long-running file ingestion, parsing, OCR pipelines, embedding generation, queue management, quotas, rate limits, and AI generation calls.

3. **Database**:
   - Neon (PostgreSQL) with `pgvector` extension for vector search.
   - Single source of truth for syllabi, chunks, question banks, PYQs, user attempts, and cached AI outputs.
   - Files are stored in object storage (e.g. S3/R2/GCS), **never** as BLOBs in the PostgreSQL database.

---

## ⚖️ The Core Rule: AI vs. Ordinary Software

Always evaluate every capability against the **Cost & Quality Ladder**:
1. **Never use AI where ordinary software does the job better, faster, and cheaper.**
   - Syllabus structure, calculations (SGPA/CGPA/attendance), question-bank quizzes, spaced repetition math (SM-2), PYQ statistics, paper blueprint assembly, and filtering must be **100% deterministic code**.
2. **Use AI only where quality depends on understanding or generating language.**
   - Explaining concepts, synthesizing 5 & 15-mark notes, fair written answer marking, Bengali/Hinglish translations, and handwriting OCR.
3. **Grounding & Sourcing are Mandatory:**
   - Every generated note or explanation must reference the source page or section from the student's material.
   - If material is missing, state it clearly. Never invent facts.
4. **Fail-Soft Principle:**
   - When AI fails, is rate-limited, or quota is exhausted, fall back gracefully to extractive summaries and template skeletons—never show blank crashes.

---

## 🎨 Visual & Aesthetic Standards

Every component, page, and UI element built by the agent must reflect [visualStyle.md](file:///c:/Users/LENOVO/Desktop/Studify/visualStyle.md):
- **Calm, delicate, premium:** Soft pastel themes, generous whitespace, hairline borders, diffuse shadows.
- **Typography:** `Urbanist` for headings & UI labels; `EB Garamond` for notes, questions, and long reading.
- **Named Themes:** Blush Rose (`#FCF5F4` / `#E7A9B5`), Sage Mist, Lavender Haze, Butter Cream, Peach Glow, November Rain.
- **Ink Color:** Soft dark ink (`#3B3540`), never pure black (`#000000`).
- **Feedback:** Gentle green and muted rose; never harsh screaming reds or aggressive screen-shaking animations.

---

## 🗂️ Specialized Skills Available in `.agents/skills/`

When performing specific tasks, consult and follow the corresponding specialized skills:

1. **`studify-visual-style`**: Building UI components, styling, animations, themes, and reading views.
2. **`studify-ai-guardrails`**: Designing prompts, managing embeddings, token budgets, caching, and open vs. hosted models.
3. **`studify-session-study`**: Ingestion pipelines, syllabus parsing, topic-mapping, gap reports, and note generation.
4. **`studify-quiz-and-exam`**: Question bank modeling, MAKAUT paper blueprint generation, PYQ analytics, and marking rubrics.

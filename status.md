# Studify (MAKAUT Study Platform) — Project Status
> Last updated: 2026-11-14 · @Rohan

---

## 🗺️ Project Overview

**Studify** is a MAKAUT-focused AI study platform that turns a student's own material into exam-ready notes, quizzes and practice papers — shaped around the university's syllabus and paper pattern.

**Stack:** Next.js · Express · Neon (Postgres) · Hosted LLM API · Open embedding/OCR models

---

## 📦 Build Phases at a Glance

| Phase | Focus | Rough Time | Status |
|-------|-------|-----------|--------|
| **0** | Foundations & decisions | 1 week | 🔴 Not started |
| **1** | Universal ingestion & basic notes | 2–3 weeks | 🔴 Not started |
| **2** | Session Study | 3–4 weeks | 🔴 Not started |
| **3** | Quizzes & understanding checks | 2–3 weeks | 🔴 Not started |
| **4** | Chapter-end exam papers | 2–3 weeks | 🔴 Not started |
| **5** | Polish, launch & growth | Ongoing | 🔴 Not started |

---

## 🏗️ Phase Details & Checklists

### Phase 0 — Foundations & Decisions
> **Done when:** One subject's syllabus + papers in hand, each output style defined in writing, working empty project deployed.

- [ ] Choose first target subject (e.g. DBMS or OS)
- [ ] Pick 2–3 chapters from that subject for early testing
- [ ] Collect real MAKAUT syllabus for that subject
- [ ] Collect recent question papers; confirm marks distribution & regulation
- [ ] Define output styles: 1-mark, 5-mark, 15-mark, last-night revision
- [x] Set up project, version control, environments, secrets management
- [ ] Interview 8–10 classmates about study habits & pain points
- [ ] Deploy working empty project to staging environment

**Style work (Phase 0):**
- [ ] Set up font loading (Urbanist, EB Garamond, Noto fallbacks) — self-hosted
- [ ] Define colour roles (page bg, card surface, text, accent, border, etc.)
- [ ] Implement first two themes; choose default theme
- [ ] Define spacing scale & motion rules (easing, timing tokens)

---

### Phase 1 — Universal Ingestion
> **Done when:** Real student files incl. a messy scan produce correct outline + sensible notes that cite source pages.

**Ingestion pipeline:**
- [ ] Detect file type and route to correct parser
- [ ] Extract text from digital PDFs, DOCX, PPTX, TXT via parsing libraries (AI-free)
- [ ] Detect image-only PDFs and route to OCR path
- [ ] Classic OCR (Tesseract / PaddleOCR) for clean printed scans
- [ ] Small open OCR model for handwriting; fallback to vision model for failed pages
- [ ] Clean output: strip headers/footers, page numbers, hyphenation breaks
- [ ] Split by headings first, then by size; tag each chunk with page + section label
- [ ] Index chunks in Postgres full-text search (+ trigram for fuzzy)
- [ ] Add open embedding model for meaning-based search (store vectors in Neon)
- [ ] Show student detected topic outline after ingestion
- [ ] Background queue with visible progress bar; never block the UI
- [ ] Enforce file size, page count, and daily upload limits
- [ ] Pasted text input path
- [ ] Image / photo-of-notes input path

**First AI output:**
- [ ] Generate 5-mark and 15-mark notes from any ingested material (with source citations)

**Style work (Phase 1):**
- [ ] Upload screen UI
- [ ] Processing states and shimmer skeleton loaders
- [ ] "Outline detected" confirmation card

---

### Phase 2 — Session Study
> **Done when:** Full chapter studied end-to-end; gap report accurate per subject-aware reviewer; notes match syllabus topics.

**Session setup:**
- [ ] Create / name a session, attach syllabus and files
- [ ] Pick syllabus from stored MAKAUT library (grows over time)
- [ ] Ingest session files through Phase 1 pipeline

**Syllabus engine (AI-free):**
- [ ] Store syllabus as structured data: dept → regulation → semester → subject → unit → topic → sub-topic
- [ ] Admin panel for syllabus entry / spreadsheet import
- [ ] Syllabus versioning (regulation changes don't break old sessions)

**Matching & gap report (AI-free first pass):**
- [ ] Keyword + synonym lists per topic (entered once)
- [ ] Classic ranking / keyword overlap to assign chunks to topics with confidence score
- [ ] Embedding-based matching as a better second layer
- [ ] Gap report: well covered / thin / missing per topic
- [ ] Extra-content warning: material outside syllabus flagged
- [ ] Study order proposal based on syllabus sequence + exam date

**Teaching in syllabus pattern (AI-needed):**
- [ ] Plain-language explanation of each topic (generate once → cache)
- [ ] 5-mark and 15-mark notes with correct heading structure
- [ ] Extractive summaries using student's own text (AI-free, no hallucination risk)
- [ ] Template answer skeletons (intro / definition / diagram / example / conclusion)
- [ ] Language options: English, Bengali, Hinglish (generate on request → cache)

**Session experience:**
- [ ] Chapter-by-chapter progress view
- [ ] "Teach me this topic" sequential flow
- [ ] Follow-up questions answered from session material first
- [ ] Bookmarks, highlights, personal notes
- [ ] Last-night revision sheet (summaries + key terms per unit)
- [ ] Session state saved and resumed exactly

**Style work (Phase 2):**
- [ ] Session dashboard with progress rings
- [ ] Topic map (covered / thin / missing in soft tones)
- [ ] Notes/reading view (serif text, wide margins, focus mode)

---

### Phase 3 — Quizzes & Understanding Checks
> **Done when:** All 3 question types generated for a chapter; marking feels fair; weak-topic tracker visibly adapts next questions.

**Question bank (AI-free backbone):**
- [ ] Store questions: type, topic, marks, difficulty, source, answer, explanation, key-points checklist
- [ ] Admin entry forms + CSV/spreadsheet import
- [ ] Contributor accounts with submission queue and review step
- [ ] Contributor leaderboard for motivation
- [ ] "Report this question" button

**Question types:**
- [ ] MCQ (with believable distractors, shuffled order)
- [ ] True/False
- [ ] Fill in the blank
- [ ] Match the following
- [ ] Short answer (5-mark style)
- [ ] Long answer (15-mark style)

**Quiz engine (AI-free):**
- [ ] Quiz scope selection: topic / chapter / unit
- [ ] Instant marking for objective questions with explanation
- [ ] Spaced repetition (SM-2 family) for missed questions and flashcards

**AI marking (strong model):**
- [ ] Build marking guide from source material (key points, structure, examples)
- [ ] AI marks typed written answers; shown beside model answer + checklist
- [ ] Keyword-coverage hint for typed answers (labelled as hint, not mark)
- [ ] Label AI marking clearly as guidance, not examiner verdict

**Learning loop:**
- [ ] Weak-topic tracker (right/wrong counts per topic, weighted to recent)
- [ ] Flashcards generated from missed points
- [ ] Session-start revisit of yesterday's weak spots

**AI content generation (batch, human-reviewed):**
- [ ] Batch-draft new questions from chapter material using strong/small model
- [ ] Human review before questions enter live bank

**Style work (Phase 3):**
- [ ] One-question-per-card quiz UI with smooth option selection
- [ ] Soft feedback animations (correct glow, wrong colour change — no harsh red/shake)
- [ ] Progress rings and score count-up

---

### Phase 4 — Chapter-end Exam Papers
> **Done when:** Completed chapter produces all paper types that look believable to a senior student/teacher; results feed weak-topic tracker.

**Paper assembly (AI-free):**
- [ ] Blueprint per subject/paper type: question counts, marks, choice rules, time
- [ ] Confirm blueprint against real recent MAKAUT papers per regulation
- [ ] Random selection from bank with balance rules (spread topics, avoid recent repeats, difficulty mix)
- [ ] PYQ tagging and statistics: frequency per topic, years appeared, marks carried
- [ ] Important-questions set (most frequent PYQ topics)

**Paper variants:**
- [ ] Full-pattern paper (real structure, correct marks distribution)
- [ ] Focused chapter test (shorter, single chapter)
- [ ] Hard mode / important-questions set

**Exam experience:**
- [ ] Timed mode with countdown + untimed practice mode
- [ ] Typed answer or photo-of-handwritten-sheet submission
- [ ] Marking scheme and model answers released after submission
- [ ] Result summary by section and topic → feeds weak-topic tracker
- [ ] Export to printable PDF (real question paper layout)

**Quality guardrails:**
- [ ] Papers labelled as practice, never claimed as real past papers
- [ ] Avoid too-similar questions across generated papers
- [ ] "Report a bad question" button

**Style work (Phase 4):**
- [ ] Exam paper screen: plain, serif, minimal colour, quiet timer
- [ ] Almost no animation in exam mode (focus-first)
- [ ] Printable layout polish

---

### Phase 5 — Polish, Launch & Growth
> **Done when:** A stranger can find the tool, complete a session unaided, and running cost per active student is known and sustainable.

**Product polish:**
- [ ] Library view: all sessions, notes, papers; searchable
- [ ] PDF export for notes and papers
- [ ] PWA setup: installable, offline reading of saved notes
- [ ] Accounts with simple signup + no-signup first try
- [ ] Bengali and Hinglish modes polished with real student feedback
- [ ] All 7 colour themes available, custom accent picker, dark mode
- [ ] Reduced-motion setting + phone reduce-motion respect
- [ ] Device testing on a real low-end Android phone

**Operations:**
- [ ] Usage limits (daily/monthly budgets in units per user), friendly usage meter
- [ ] Caching pipeline: same topic + style + source → serve cached output
- [ ] Error tracking, feature analytics, cost monitoring dashboard
- [ ] Neon storage monitoring from week 1; prune old sessions on schedule
- [ ] Backups and user data deletion on request

**Growth:**
- [ ] Launch in batch/college WhatsApp and Telegram groups, timed to internals/semester exams
- [ ] Invite toppers to contribute syllabus structure and verified question sets
- [ ] Public changelog; fast feedback response loop
- [ ] Expand subject-by-subject based on user demand

---

## 🤖 AI vs. Non-AI Decision Summary

| Feature area | Approach |
|---|---|
| Digital PDF/DOCX/PPTX parsing | ✅ AI-free (libraries) |
| Clean printed scans OCR | ✅ AI-free (Tesseract/PaddleOCR) |
| Handwriting & diagram OCR | 🤝 Small open OCR model → vision model fallback |
| Keyword/full-text search | ✅ AI-free (Postgres FTS + trigram) |
| Meaning-based search & topic matching | 🔓 Open embedding model (multilingual-e5-small to start) |
| Syllabus structure & storage | ✅ AI-free (admin data entry) |
| Gap report & study order | ✅ AI-free (counting & scheduling logic) |
| Extractive summaries | ✅ AI-free (frequency + position ranking) |
| Objective quizzes | ✅ AI-free (question bank) |
| Spaced repetition & weak-topic tracking | ✅ AI-free (SM-2 maths, counts) |
| Exam paper assembly | ✅ AI-free (blueprint + bank) |
| PYQ statistics | ✅ AI-free (counting & sorting) |
| CGPA/SGPA/attendance calculators | ✅ AI-free |
| Plain-language explanations & notes | 🧠 AI (strong hosted model, cached) |
| 5-mark & 15-mark exam answers | 🧠 AI (strong model, cached per student per topic) |
| Marking written answers | 🧠 AI (strong model, shown with checklist) |
| Bengali/Hinglish explanations | 🧠 AI (strong model, generate on request → cache) |
| Follow-up questions | 🧠 AI (rationed, answered from retrieved sections) |
| Batch question drafting | 🤝 Small open/offline model → human review |

---

## 🎨 Style & Design Status

| Design area | Status |
|---|---|
| Design principles defined | ✅ Done (documented in visualStyle.md) |
| Typography chosen | ✅ Done (Urbanist + EB Garamond + Noto fallbacks) |
| Colour themes defined (7 themes) | ✅ Done (Blush Rose, Sage Mist, Lavender Haze, Sky Whisper, Butter Cream, Peach Glow, November Rain) |
| Motion & animation rules | ✅ Done (documented) |
| Key screen feels defined | ✅ Done (documented) |
| Fonts implemented in project | 🔴 Not started |
| Colour token system built | 🔴 Not started |
| Dark mode | 🔴 Not started |
| Component library built | 🔴 Not started |
| Low-end Android device testing | 🔴 Not started |

---

## ❓ Open Decisions

| # | Question | Status |
|---|---|---|
| 1 | Which subject launches first? | ❌ Undecided |
| 2 | Which two themes ship first, and which is the default? | ❌ Undecided |
| 3 | Is dark mode needed at launch, or post-launch? | ❌ Undecided |
| 4 | Small interface text: Urbanist or another font? | ❌ Undecided |
| 5 | Which low-end Android phone for testing? | ❌ Undecided |
| 6 | Which MAKAUT regulation + year is the reference for paper patterns? | ❌ Undecided |
| 7 | Embedding model: start with Node (ONNX) or set up Python service immediately? | ❌ Undecided |
| 8 | OCR approach: Tesseract first, PaddleOCR, or both? | ❌ Undecided |
| 9 | Hosted text model for notes: which provider + model? | ❌ Undecided |
| 10 | Monthly budget for hosted AI at start? | ❌ Undecided |
| 11 | Licence terms acceptable for chosen open models? | ❌ Undecided |
| 12 | Who will help build the first subject's question bank? | ❌ Undecided |
| 13 | Express service host — does it have enough RAM for embedding model? | ❌ Undecided |
| 14 | Accounts from day one, or only after first useful result? | ❌ Undecided |
| 15 | How much free usage per student can we afford? | ❌ Undecided |

---

## 📋 Decision Log

| Decision | Outcome | Date |
|---|---|---|
| Stack | Next.js + Express + Neon (Postgres) | Pre-Nov 2026 |
| Embedding model | ⏳ Not decided | — |
| OCR approach | ⏳ Not decided | — |
| Hosted text model for notes | ⏳ Not decided | — |
| First subject | ⏳ Not decided | — |
| Default colour theme | ⏳ Not decided | — |

---

## 🚦 Current Status Summary

> **Phase:** Phase 0 — Foundations in progress.

- 📄 Technical implementation plan: **complete**
- 🤖 AI feasibility & cost strategy: **complete**
- 🎨 Visual style guide: **complete** (3 open style decisions remain)
- 💻 Codebase: **initialized** (Next.js with `src/pages` + Tailwind CSS frontend, Express + TypeScript backend, Git repository setup & builds verified)
- 🗄️ Syllabus data: **not started**
- 🧪 User interviews (8–10 classmates): **not started**

**Next action → Continue Phase 0:** Pick the first subject, collect its syllabus + recent papers, and interview classmates.

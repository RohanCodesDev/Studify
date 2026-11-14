# Studify — Feature List
> Extracted from all planning docs · Nov 14, 2026

---

## 1. Ingestion

- Upload **PDFs** (text-based and scanned), **Word docs**, **PowerPoints**, **plain text**, and **images** (including photos of handwritten notes)
- **Paste text** directly without uploading a file
- Auto-detect file type and route to the correct reader
- Extract text from digital files using parsing libraries (no AI needed)
- **Classic OCR** for clean printed scans (Tesseract / PaddleOCR)
- **Handwriting and diagram reading** using small open OCR model; falls back to a vision model for pages it can't read
- Clean up extracted text: strip repeated headers/footers, page numbers, hyphenation breaks, extra whitespace
- Split content by **headings and topics** (not fixed sizes), keeping each piece traceable to its source page
- **Full-text and fuzzy search** inside uploaded material (Postgres FTS + trigram, no AI)
- **Meaning-based search** using an open embedding model, stored as vectors in the database
- Background processing with a **visible progress bar** — the UI never feels frozen
- Short **topic outline shown after ingestion** so students catch bad reads early
- Student can **correct OCR errors** before the text is used
- Manual fallback: student can **type or paste a topic** if a page can't be read
- File size, page count and daily upload **limits** to keep costs predictable
- Each file processed once and stored; never reprocessed
- Every upload is **private to the user** by default

---

## 2. Syllabus Engine

- Store the MAKAUT syllabus as **structured data**: department → regulation → semester → subject → unit → topic → sub-topic (with weightage and hours where listed)
- **Admin panel** to enter or import syllabi (spreadsheet / CSV import supported)
- **Syllabus versioning** so regulation changes don't break existing sessions
- Stable topic list per subject that every other feature hangs off
- Growing **library of stored MAKAUT syllabi** students can pick from

---

## 3. Session Study

- Student creates a **named session** and attaches a syllabus plus any supporting material
- System ingests all material and **maps each chunk to syllabus topics** using keyword + embedding matching
- Confidence score per mapping; low-confidence chunks go to an **"unsorted" list** the student can drag into place
- **Gap report**: which syllabus topics are well covered, thin, or missing entirely from the student's material
- **Extra-content warning**: material that doesn't match any syllabus topic is flagged
- **Study order** proposed from the syllabus sequence and the student's exam date
- **Plain-language explanation** of each topic (generated once and cached)
- **Exam-level notes** in the student's chosen mark style (1-mark, 5-mark, 15-mark) with the headings an examiner expects
- **Extractive summaries** using the student's own text (frequency + position ranking, no hallucination risk)
- **Template answer skeletons** per mark style (intro / definition / diagram / example / advantages / conclusion) with extracted content slotted in
- **Key terms list** pulled from defined, bolded, or heading terms in the material
- **Language options**: English, Bengali, Hinglish for the explanatory parts (generated on request and cached)
- Chapter-by-chapter **progress view** with progress bars — always shows what's done and what's left
- **"Teach me this topic"** sequential flow through a topic instead of dumping everything at once
- **Follow-up questions** answered from the session's own material first, then clearly labelled general knowledge
- **Bookmarks, highlights, and personal notes** on any section
- **Last-night revision sheet** that stitches together summaries and key terms per unit
- Session state **saved and resumed** exactly where the student left off
- **Source references** shown beside every explanation; report-an-error button on every output
- If a topic isn't covered by the student's material, the system **says so clearly** and offers general-knowledge fallback, labelled

---

## 4. Quizzes & Understanding Checks

- **Question bank** storing: type, topic, marks, difficulty, source (PYQ year or contributor), answer, explanation, key-points checklist
- **Six question types**: MCQ, true/false, fill in the blank, match the following, short answer (5-mark style), long answer (15-mark style)
- Student chooses **quiz scope**: one topic, a chapter, or a whole unit
- Student chooses **question types and count**
- Option order and question order **shuffled** to reduce position memorisation
- **Instant marking** of objective questions with explanation of the correct answer
- **Written answer review**: student writes (or skips to see), then reveals model answer with key-points checklist; student ticks which points they covered → self-score recorded
- **AI marking of typed written answers** against a generated marking guide (key points, structure, examples); score + what was covered + what was missed + model answer shown
- AI marking **clearly labelled as guidance**, not an examiner's verdict
- **Keyword-coverage hint** for typed answers (flags which expected terms were absent; labelled as a hint)
- **Spaced repetition** (SM-2 family) for flashcards and missed questions
- **Weak-topic tracker**: right/wrong counts per topic over time, weighted toward recent attempts
- **Flashcards** generated from missed key points for quick revision
- **Session-start revisit** of previous session's weak spots
- Difficulty adapts: topics the student gets wrong come back more often
- **Contributor accounts**: friends can submit questions, answers and topic tags; held in a review queue before going live
- **Reviewer step**: a second person approves before a question is published
- **Contributor leaderboard** to credit and motivate contributors
- **"Report this question"** button on every question
- Batch AI-drafted new questions (using a small or strong model offline), human-reviewed before entering the live bank

---

## 5. Exam Papers

- **Blueprint per subject and paper type**: question counts, marks categories, choice rules, time allowed — confirmed against real recent MAKAUT papers
- Paper questions drawn from the question bank with **balance rules**: spread across topics, avoid recent repeats, respect difficulty mix
- **Three paper variants**:
  - Full-pattern paper — real structure, correct marks distribution
  - Focused chapter test — shorter, single chapter only
  - Hard mode / important-questions set — tougher questions or the most frequently appearing PYQ topics
- **PYQ intelligence**: each past question stored with year, paper, marks, and syllabus topics; "appeared in 6 of the last 8 papers" stat shown per topic
- PYQ frequency used to weight blueprints and guide study order
- **Timed mode** with a countdown, or untimed practice mode
- Answers can be **typed or photographed** (handwritten sheets marked with the same ingestion + marking tools)
- **Marking scheme and model answers** released after the student submits
- **Result summary** by section and by topic, feeds directly into the weak-topic tracker
- Export to **printable PDF** in real question paper layout
- Papers labelled as practice, never claimed as real past papers
- Avoid too-similar questions across generated papers
- **"Report a bad question"** option

---

## 6. Utilities

- **SGPA, CGPA and percentage calculators** with MAKAUT's grading rules
- **Attendance and bunk planner**
- **Exam countdown** timer
- **Study timetable** generator
- **Notes library**: upload notes, add subject tags, search, upvote, report; moderation built in from the start
- All utilities work **without login** and bring in users who later try the study features

---

## 7. Platform & Accounts

- **No-signup first try** — student can get a first useful result without an account
- Simple **account signup** to save sessions, notes and papers
- **Offline reading** of saved notes (PWA, cached locally)
- **Library view** for all sessions, notes and papers, with search
- **PDF export** for notes and papers
- **Installable mobile experience** (PWA) that works on weak networks
- **Usage limits** for free users (daily and monthly budgets in units), with a friendly usage meter
- Usage budget in units: a 15-mark answer costs more than a flashcard
- **Fail soft**: if budget or rate limit is hit, fall back to the AI-free version (extractive summary, template notes) rather than showing an error
- **Caching** of repeated AI outputs (same topic + style + source → serve from cache; public syllabus content shared across all students, private content stays private)
- Theme choice, font size, and reading settings saved to account; also saved to device for signed-out users
- User data **deletion on request**

---

## 8. Personalisation & Accessibility

- **7 colour themes**: Blush Rose, Sage Mist, Lavender Haze, Sky Whisper, Butter Cream, Peach Glow, November Rain
- **Light, dark, or follow the phone** (dark mode uses deep muted backgrounds tinted with the theme hue, never pure black)
- **Custom accent colour picker** (app generates matching soft tints; quietly adjusts if contrast would be poor)
- **Reading settings**: text size, warmer or cooler paper tone
- **Reduced-motion setting** in-app, plus automatic respect for the phone's reduce-motion preference
- Theme change **cross-fades** across the whole screen instead of flashing
- **Language options** per explanation: English, Bengali, Hinglish
- Colour meaning always backed by an **icon and a word** (never colour alone)
- Soft haptic taps on phones where supported
- **Focus mode** in the reading view that hides everything except the text

---

## 9. Trust & Quality

- Every answer grounded in the **student's own uploaded material**; general knowledge fallback clearly labelled
- **Source page or section** shown next to every explanation
- **Report-an-error button** on every question, note, explanation and paper
- Reports reviewed regularly; fixes published in a visible changelog
- Outputs tested with **subject-aware reviewers** before each subject goes live
- Contributor content goes through a **review queue** before it's live
- Wrong answers use gentle language (soft green and muted rose); no harsh red, no shaking or buzzing
- Warm, encouraging wording throughout — no technical or stern messages
- Friendly **empty states** with a light illustration and one clear next step
- **Instant feel**: cached or placeholder content shown immediately; details fill in after

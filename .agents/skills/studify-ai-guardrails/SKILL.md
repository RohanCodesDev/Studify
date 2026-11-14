---
name: studify-ai-guardrails
description: >-
  Use this skill whenever implementing, modifying, or testing AI features, LLM prompts,
  embeddings, vector searches, OCR processing, token budgets, or caching logic.
---

# Studify AI Feasibility & Cost Guardrails Skill

This skill enforces strict cost control, resilience, and quality standards across all AI-driven features in Studify.

---

## 1. The Decision Rule: Ordinary Code vs. AI

| Capability | Approach | Why |
| :--- | :--- | :--- |
| **Syllabus storage & tree** | 100% Ordinary Software | Exact, relational, deterministic |
| **Full-text / keyword search** | 100% Postgres FTS + Trigram | Fast, zero API cost, exact hits |
| **Topic matching (first pass)** | Keyword overlap & ranking | Predictable, zero cost |
| **Topic matching (semantic)** | Open Embedding Model (`pgvector`) | Run once per chunk, search for free |
| **Calculators (SGPA/CGPA/bunk)** | 100% Ordinary Software | Pure mathematical rules |
| **Spaced repetition (SM-2)** | 100% Ordinary Software | Simple interval arithmetic |
| **Paper blueprint assembly** | 100% Ordinary Software | Exact rules on marks, units, counts |
| **PYQ intelligence & stats** | 100% Postgres queries | Pure counting, sorting, aggregation |
| **Printed scan OCR** | Classic OCR (Tesseract/PaddleOCR) | Free, accurate for clean print |
| **Handwriting OCR** | Small open OCR → Vision API fallback | Cost-staged pipeline |
| **Notes explanations (1/5/15 marks)** | Strong Hosted LLM + Caching | High quality required for exams |
| **Marking written answers** | Strong Hosted LLM + Rubric | Requires deep comprehension |
| **Bengali / Hinglish modes** | Strong Hosted LLM (on-demand cache) | Nuanced colloquial phrasing |

---

## 2. The 5-Rung Cost Ladder

Before making any LLM call, evaluate the cheapest viable rung:
1. **Rung 1: Rules & Counting (Free):** Use SQL, regex, and algorithms.
2. **Rung 2: Cached Results (Free):** Check cache (Redis/Postgres). If a public syllabus topic has already been generated or a student previously generated this topic notes, return cached output.
3. **Rung 3: Small Open Model (Fixed server cost):** For embeddings (`multilingual-e5-small`) and initial OCR passes.
4. **Rung 4: Fast/Cheap Hosted Model:** For routine tasks (distractor generation, metadata tagging, query reformulation).
5. **Rung 5: Strong Hosted Model:** Reserved strictly for 15-mark comprehensive exam answers, complex diagram descriptions, and fair marking of written answers.

---

## 3. Strict Context & Retrieval Discipline

- **Retrieve, Do Not Dump:** Never pass entire uploaded documents into prompt context. Pass only the top 3–5 relevant chunks (max 1,500–2,000 tokens) retrieved via hybrid search (keyword + vector).
- **Mandatory Grounding:** System prompts must instruct the model:
  - *"Base your answers strictly on the provided context sections."*
  - *"Cite the source page/section for every factual point or definition."*
  - *"If the student's material does not contain the answer, explicitly state that it is missing from their notes before offering a labeled general-knowledge explanation."*
- **Cap Output Tokens:** Enforce `max_tokens` limits depending on mark style:
  - 1-mark objective: ~50–100 tokens
  - 5-mark short answer: ~350–500 tokens
  - 15-mark comprehensive: ~1,000–1,500 tokens

---

## 4. Neon PostgreSQL & Vector Budgeting

- **No Raw Files in Database:** Store uploaded files in S3/R2/GCS object storage. Neon only stores chunk text, vector embeddings, and metadata pointers.
- **Vector Dimension Discipline:** Prefer smaller embedding vectors (e.g. 384 dimensions with `multilingual-e5-small`) over 1024/1536 dimensions. 384 dimensions uses ~60% less storage space in Neon.
- **Pruning & Archival:** Archive or delete inactive student sessions older than 90 days.

---

## 5. Resilience & Fail-Soft Architecture

When an AI provider is down, experiencing latency, or a student's daily quota is exhausted:
- **Never crash or show blank pages.**
- **Notes Fallback:** Render the **Extractive Summary** (ranking student sentences by frequency/position) slotted into the **Template Skeleton** (Intro, Definition, Key Points, Conclusion).
- **Marking Fallback:** Display the **Model Answer Checklist** so the student can self-evaluate by checking off points.
- **Search Fallback:** Switch from vector semantic search to Postgres Trigram full-text search.
- **Handwriting Fallback:** Provide a prompt allowing the student to manually type or paste their notes.

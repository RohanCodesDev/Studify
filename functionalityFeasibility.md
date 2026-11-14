MAKAUT Study Platform: Where to Use AI and Where to Skip It
Companion to the phased technical plan. It answers three questions: which parts of the platform need AI to be good, which parts work better as ordinary software, and where open Hugging Face or PyTorch models can do a job as well as a paid AI API. The rule throughout: use AI wherever quality depends on it, skip it where it adds little, and never lower quality just to save money. Stack: Next.js, Express and Neon (Postgres).
Model names, prices and free-tier limits below were checked in November 2026 and change often. Re-verify anything cost-critical before committing.
1. The core idea
Use the right tool for each job: ordinary software for anything exact, repeatable or data-driven, and AI wherever quality depends on understanding or writing language. Ordinary software handles the syllabus, question bank, PYQ statistics, paper assembly, trackers and search, which are fast, cheap and exact. AI handles explaining, rewriting, generating new questions, marking written answers and reading messy handwriting, where doing without it would lower quality.
This gives three benefits:
• Exact tasks stay fast and correct, because no AI is guessing at them.
• AI spend goes only where it improves what the student learns.
• The curated data you build (clean syllabus, tagged PYQs, verified question bank) becomes your real moat, because it is accurate and hard to copy.
2. Roles of the three stack pieces
Piece
Role
Notes
Next.js
Student-facing app: pages, reading view, quiz and paper screens, PWA
Keep light server work here (auth, reading saved data)
Express
The backend worker: file processing, ingestion jobs, quiz and paper assembly, AI calls, queues, quotas
Long or heavy work lives here, not in Next.js request handlers
Neon (Postgres)
Single source of truth: users, syllabus, chunks, question bank, PYQs, attempts, cached AI outputs, vector search
Free plan is generous but has hard limits (see section 9)
Why split Next.js and Express: file parsing, OCR and AI calls can take a long time and need retries and queues. Running them in a separate Express service keeps the web app fast and lets you move that service to a different host, or add a Python model service next to it later, without touching the front end.
3. Overview: what needs AI and what does not
Capability
Without AI
Where AI genuinely helps
Reading digital PDFs, Word, slides
Fully AI-free (parsing libraries)
None
Reading printed scans
Mostly AI-free (classic OCR)
Hard layouts
Reading handwriting and diagrams
Weak without models
Small OCR models, or vision models for the hard pages
Searching inside uploaded material
Full-text search in Postgres, good for keywords
Meaning-based search (embeddings, can be a free open model)
Syllabus structure and storage
Fully AI-free (data entry)
Optional: help turning a pasted syllabus into structure
Matching notes to syllabus topics
Keyword and ranking methods give a decent first version
Embeddings improve accuracy
Gap report and study order
Fully AI-free once matching exists
None
Objective quizzes
Fully AI-free from a question bank
Generating new questions
Short and long answer practice
AI-free with model answers and self-marking checklists
Marking a typed answer, writing new model answers
Spaced repetition and weak topics
Fully AI-free (simple maths and counts)
None
Exam paper assembly
Fully AI-free from a tagged bank using a blueprint
New questions to widen the bank
PYQ intelligence
Fully AI-free (counting tags)
Optional help with tagging
CGPA, attendance, planners
Fully AI-free
None
Notes explanation in plain language, 5 and 15 mark answers
Not really possible
Core AI job
Bengali and Hinglish explanations
Not possible
AI job
Free-form questions on the student's material
Not really possible
AI job
Rough guide: around two thirds of the platform by feature count needs no AI, and the AI parts are what make the product a teacher instead of a resource hub. Decision rule: use AI when the task needs understanding or writing language (explaining, rewriting, marking, reading handwriting); skip it when the task is exact, repeatable or data-driven (calculators, counting, filtering, scheduling, question-bank quizzes).
4. Part A: What works best as ordinary software, and how
4.1 Ingestion without AI
Digital files (PDF, DOCX, PPTX, TXT)
• Use ordinary parsing libraries in Express to pull out text, headings, lists and tables, plus page numbers.
• Detect whether a PDF has real text or is just page images. If it has text, it is free to process. If not, send it down the scan path.
• Clean the text by removing repeated headers and footers, page numbers, hyphenation breaks and extra whitespace.
• Split by headings first, then by size where a section is too long. Store each piece with its page and section label so every answer can point back to a source.
Scanned printed pages
• Run a classic OCR engine (Tesseract or PaddleOCR) on a server. It is free to run and good for clean print.
• Show the student the extracted text and let them fix obvious errors before it is used.
Handwriting and diagrams
• Classic OCR struggles here. Options are covered in Part C (small open OCR models first, vision AI only for pages that fail).
• Always give a manual fallback: let students type or paste a topic if a page cannot be read.
Searching the material
• Postgres full-text search plus trigram matching gives fast keyword and fuzzy search with no AI and no extra service.
• Later, add vector search in the same database with a free open embedding model (Part C), which is meaning-based search, still without paid AI.
Processing pipeline discipline
• Process each file once, store the result, never reprocess.
• Run in a background queue with visible progress and a short outline shown at the end so students catch bad reads early.
• Enforce file size, page count and daily upload limits.
4.2 Syllabus engine (the backbone)
• Store the MAKAUT syllabus as structured data: department, regulation, semester, subject, unit, topic, and optional sub-topics, hours and weightage.
• Build a simple admin panel (a protected page in Next.js) to enter or import syllabi. Allow spreadsheet import so you or contributors can load a subject in minutes.
• Add versioning, so a change in regulation does not break old sessions.
• Each subject gets a stable topic list. Every other feature (notes mapping, quizzes, PYQs, papers) hangs off these topic entries.
Matching a student's uploaded material to syllabus topics without AI
• For each syllabus topic, store a short list of keywords and synonyms (entered once by you or contributors).
• Score each chunk of the student's material against each topic using a classic ranking method and keyword overlap.
• Assign each chunk to the best topic or topics, with a confidence level. Low-confidence chunks go to an "unsorted" list the student can drag into place.
• This is not perfect, but it is predictable, free, and improves as the keyword lists improve.
Gap report and study order
• For each topic count how many matched chunks exist and how much text. Classify as well covered, thin, or missing.
• List material that matched no topic as possibly outside the syllabus.
• Produce a study order from the syllabus sequence and the student's exam date, with plain scheduling logic.
4.3 Session Study without AI
A session is a container: one syllabus, many files, a map from material to topics, and a progress record. Everything below needs no AI:
• Create and name sessions, attach syllabus and files, see processing status.
• Chapter and topic checklist with progress bars.
• Reading view per topic: show the student's own matched sections in order with source labels, plus the extractive summary (below).
• Extractive summaries: select the most important sentences from the student's own text using classic ranking (frequency and position based methods). Output is the student's own words, so no hallucination.
• Key terms list: pull defined terms and bold or heading terms from the material.
• Topic notes templates: for each mark style (1, 5, 15), a fixed answer skeleton the student can see (introduction, definition, diagram, example, advantages, conclusion) with their extracted content slotted in where it fits.
• Bookmarks, highlights, personal notes and a last-night revision sheet that stitches together summaries and key terms per unit.
4.4 Quizzes without AI
Question bank as the engine
• Store questions with type, topic, marks, difficulty, source (PYQ year or contributor), answer, explanation and, for written types, a key-points checklist.
• Types: MCQ, true/false, fill in the blank, match the following, short answer, long answer.
Objective questions
• Marked instantly and exactly. Wrong options come from the bank, so build each MCQ with good distractors at entry time.
• Shuffle option order and question order to reduce memorising by position.
Written questions
• Show the question, let the student write (or skip to see), then reveal the model answer with the key-points checklist.
• Student ticks which points they covered. The system records a self-score. This is free and surprisingly effective for learning.
• An optional keyword-coverage check can flag which expected terms were missing in a typed answer. It is crude, so label it a hint rather than a mark.
Adaptive practice
• Use a standard spaced repetition method (the SM-2 family) for flashcards and for missed questions. It is simple arithmetic on how well the student remembered.
• Weak-topic tracker is just right and wrong counts per topic over time, weighted toward recent attempts.
• Quiz scope selection (topic, chapter, unit) is a database filter.
4.5 Exam paper assembly without AI
• Define a blueprint per subject and paper type: how many questions of each marks category, from which units, with choice rules and time allowed. Confirm these against real recent papers.
• Assemble by random selection from the bank with balance rules: spread across topics, avoid repeats from the student's recent papers, respect difficulty mix.
• Three variants to offer after a chapter: full-pattern paper, focused chapter test, and an important-questions set built from the most frequent PYQ topics.
• Add timer, instructions page, answer sheet, marking scheme and model answers released after submission.
• Export to printable PDF with the layout of a real question paper using a document template.
• Result summary by section and topic feeds the weak-topic tracker.
The only limit here is the size and quality of the question bank. See section 5 for how to fill it cheaply.
4.6 PYQ intelligence without AI
• Store each past question with year, paper, marks, and the syllabus topics it tests.
• Compute for each topic how often it appeared and in which years, which marks it carried, and how recently. Show "appeared in 6 of the last 8 papers".
• Use these counts to power an important-questions list, to weight paper blueprints, and to guide study order.
• This is pure counting and sorting in the database, and it is likely your strongest unique feature.
4.7 Utilities without AI
• SGPA, CGPA and percentage calculators with the university's rules, attendance and bunk planner, exam countdown, and study timetable.
• Notes library with upload, subject tags, search, upvotes, reports and moderation. Hosting is user-uploaded content, so add reporting and takedown from the start.
• These work with no login and bring in users who later try the study features.
4.8 Platform plumbing (all AI-free)
• Accounts, sessions, quotas and rate limits, usage logs, admin dashboard, error tracking, backups.
• Progressive web app setup, offline reading of saved notes, and PDF export.
• Feedback and "report wrong content" buttons attached to every question, note and paper.
5. Building the content engine cheaply
The question-bank approach only works if the bank is good. That is a data task, not a coding task.
Sources of content (respect copyright)
• Syllabus: official university documents, entered or imported once per subject.
• PYQs: tag past papers you can legally use for study. Type them in or import from your own collection.
• Questions: write from your own knowledge and your class notes, or collect from friends and toppers who contribute their own original questions and answers.
• Never publicly host copyrighted textbooks or entire third-party notes.
Process
1.  Admin panel with fast entry forms and CSV or spreadsheet import.
2.  Contributor accounts: friends can submit questions, answers and topic tags. Every submission is held in a review queue.
3.  Review step: a second person (or you) approves before it goes live. Track who reviewed what.
4.  Credit contributors on a leaderboard. It motivates good work for free.
5.  Add a "report this question" button, and fix reports weekly.
Using AI to speed the content work (optional and one-time) You can use an AI model to draft candidate questions and model answers from a chapter, then have a human verify them before they join the bank. This is a one-time cost per question, and after that the question serves unlimited students for free. It is far cheaper than generating on every request, and it keeps quality under human control.
6. Part B: Where AI is needed, and how to use it well without waste
6.1 The cost ladder
For every task, pick the cheapest rung that still gives the quality that task needs. For quality-critical work (long answers, marking), start higher up the ladder.
1.  Rules and counting (free)
2.  Cached or pre-generated result (free after the first time)
3.  Small open model run by you (fixed server cost, no per-call fee)
4.  Cheap hosted model (small per-call cost)
5.  Strong hosted model (highest cost, used rarely)
6.2 Task by task plan
AI task
Cheapest approach
When to climb the ladder
Meaning-based search and topic matching
Open embedding model run on your own server, stored in Neon vectors
Almost never
OCR of print
Classic OCR
When layout is messy
OCR of handwriting and diagrams
Small open OCR model first
Fall back to a vision model only for failed pages
Plain-language explanation of a topic
Generate once per topic and style, cache and reuse for everyone when it comes from public syllabus content
Stronger model if small model quality is poor
5-mark and 15-mark notes from student's material
Retrieve only the relevant sections, generate, cache per student per topic
Use a stronger model for long answers only
Generating new questions
Pre-generate in batches, human review, then store in bank
Do not generate live
Marking written answers
AI marking with a strong model, shown beside the model answer and checklist
Stronger model, since marking quality matters
Bengali and Hinglish versions
Generate only on request and cache
Stronger model, since small models are weaker in these languages
Free-form follow-up questions
Answer from retrieved sections with strict length limits and daily caps
Keep this the most rationed feature
6.3 Techniques that avoid waste without lowering quality
• Retrieve, do not dump. Send only the few relevant sections, never whole documents. This is usually the biggest saving.
• Cache everything. Same topic plus same style plus same source gives the same output, so serve it again. Public syllabus-based content can be shared across all students. Anything built from a private upload stays private.
• Pre-generate off-peak and in batches. Non-urgent work (quiz banks, summaries for popular topics) can be run in bulk using lower-priced batch options where a provider offers them.
• Cap output length per mode and keep instruction templates short.
• Right-size the model. Cheap models for classification, cleaning, flashcards and question drafts. Use strong models for long answers, marking and anything students rely on for exams.
• Quotas in units. Give each user a daily and monthly budget in units where a 15-mark answer costs more than a flashcard. Show a friendly usage meter.
• Fail soft. If the budget or rate limit is hit, fall back to the AI-free version of the feature (extractive summary, template notes) rather than showing an error.
• Measure. Log every AI call with feature, model, tokens and user. Review weekly. Run a one-week pilot with classmates and extrapolate cost per student before launch.
7. Part C: Hugging Face and PyTorch models
7.1 Short answer
Yes, open models can do a lot of the work, especially the cheap, high-volume jobs: embeddings, OCR and classification. Small open text-generation models can also run, but their quality for long exam answers and for fair marking is the weak point, and Bengali and Hinglish quality is a particular risk.
PyTorch is the engine most of these models run on. Hugging Face is the place you download them from. You do not need to train anything. You download a model and run it.
7.2 Three ways to run open models in your stack
Option
How
Pros
Cons
A. In Node
Run small models inside the Express service using an ONNX-based JavaScript library
One language, simple deploy
Best only for small models, slower than Python for bigger ones
B. Small Python service
A separate FastAPI service using PyTorch and the Hugging Face libraries, called from Express
Widest model support, easiest to follow tutorials
Another service to host and monitor
C. Hosted inference
Call models through a provider
No servers to run
Costs money, and the free credits on a free Hugging Face account are essentially nothing (a few cents or none; PRO gives about 2 dollars a month)
Recommended: start with option A for embeddings if it performs acceptably, move to option B when you add OCR or a local text model, and treat option C as a fallback rather than a plan.
Free hosting reality: Hugging Face Spaces offers a free CPU tier with roughly 2 vCPUs and 16 GB RAM, which is enough to experiment with embeddings and small OCR, but free Spaces can sleep and are not a dependable production host. Free GPU access is a small daily quota, so do not design around it.
7.3 Embeddings (best use of open models)
Embeddings turn text into numbers so you can search by meaning and match notes to syllabus topics. This is the most cost-effective place to use an open model, because you run it once per chunk and then search in Neon for free.
Candidates seen in November 2026:
Model
Size and notes
Fit
multilingual-e5-small
About 118M parameters total with only about 22M active, very widely downloaded, multilingual
Best first choice for a small server and low storage
BGE-M3
About 568M parameters, 1024 dimensions, 100+ languages, strong hybrid retrieval
Better quality, heavier and uses more storage
jina-embeddings-v5-text (nano and small)
Sub-1B multilingual, strong benchmark results, long context
Strong option if licence terms suit your use
Qwen3-Embedding-0.6B
Small multilingual, open weight
Good middle option
all-MiniLM-L6-v2
Tiny 23M model, extremely popular, mainly English
Fine for English-only notes, weaker for mixed languages
Guidance:
• Start with multilingual-e5-small, because notes may mix English with Bengali or Hindi terms.
• Test two models on 30 real questions from your first subject and pick by actual results, not leaderboards.
• Check each model's licence before commercial use.
• Smaller vectors use less space. This matters on the Neon free plan (see section 9).
7.4 OCR (handwriting and scans)
Candidates:
Model or tool
Notes
Fit
Tesseract
Classic, free, good on clean print
First pass for printed scans
PP-OCRv6 (PaddleOCR)
Three tiers (about 1.5M, 7.7M and 34.5M parameters), 48+ languages, handles printed and handwritten text, built for light deployment
Strong candidate for a cheap server
PaddleOCR-VL
About 0.9B parameters, about 109 languages, handles handwriting and tables
Heavier but still small, better on complex pages
Granite-Docling
About 258M parameters, parses whole page structure
Good for tables and layout
Other open document models (dots.ocr, olmOCR, DeepSeek-OCR)
Larger, GPU-oriented
Probably too heavy for a free or cheap server
Guidance:
• Use a two-stage approach: classic or small OCR first, a larger model only on pages with low confidence.
• Test on real student photos (poor lighting, pen on lined paper). Handwriting is the hardest case, so expect imperfect results and keep the student correction step.
• Be careful when reading vendor claims: benchmarks are often from the model maker's own tests.
7.5 Small text-generation models
These could write explanations and notes without any API fee, but you pay in server cost and in quality.
Candidates around the 3 to 8 billion parameter size: Qwen3.5 4B, Qwen3 8B, Gemma 4 E4B, Phi-4-mini, SmolLM3 3B and Llama 3.2 3B. Quantised versions of 3 to 4B models can run on a CPU server with about 8 GB RAM at usable but slow speeds. 8B models run better with a good CPU or any GPU.
Honest assessment for this product:
Job
Small open model suitability
Cleaning text, tagging topics, drafting quiz distractors
Good
Short plain-language explanations from provided text
Fair to good
Long 15-mark answers with correct structure and facts
Mixed, needs human review
Marking written answers fairly
Weak, risky
Bengali and Hinglish explanations
Weak, though community fine-tunes exist for related languages such as Hindi, so test before trusting
Factual accuracy without source text
Inconsistent at this size, so always ground in retrieved text
Two more practical issues: CPU generation is slow, so a student may wait a long time for a long answer, and free hosting rarely has the RAM or compute for an 8B model. A small model running on a laptop or home machine can be used for offline batch jobs (pre-generating draft questions or summaries), which is a good fit and costs nothing but electricity.
7.6 Verdict for this project
Area
Recommendation
Embeddings
Use open models. Biggest saving, low risk
OCR
Use classic plus small open OCR first, and send handwriting and difficult pages to a vision model so students get accurate text. Keep the student correction step
Text generation for students
Use a strong hosted model, with caching to avoid repeat work. Small open models are not reliable enough yet for exam-style answers
Offline batch drafting of questions
Good use of a small open model on your own machine, with human review
Marking written answers
Use AI marking with a strong model, with the model answer and checklist shown alongside
8. Resilience: what to do when AI is slow or unavailable
AI will sometimes be slow, rate-limited or down. For those moments only, each AI feature has a simpler version to fall back on:
AI feature
Fallback when AI is off, over budget or failing
Written notes in exam style
Extractive summary and template skeleton filled with the student's own text
New questions
Existing question bank
AI marking
Model answer and self-marking checklist
Semantic search
Keyword full-text search
Handwriting reading
Manual typing or pasting of the topic
Follow-up questions
Search results from the student's material with source links
These fallbacks cover outages and rate limits. They are not the normal experience: when AI is available, students get the AI version.
9. Neon-specific planning
Based on Neon's published free plan as of late 2026:
• Free plan allows 100 projects, with about 1 GB storage per project (up to 20 GB total) and 100 compute hours per project per month. Storage was recently doubled from 0.5 GB, so check the current figure.
• When the storage limit is hit, writes that add data fail until you free space or upgrade. Compute that is not used stays suspended.
• Compute suspends after a few idle minutes on the free plan, so the first request after idle has a cold start delay. Plan the interface to show a loading state and consider a lightweight keep-warm approach only if it does not use up compute hours.
• Vector search is supported through the standard Postgres vector extension, and approximate indexes are available for faster search.
Storage budgeting (rough thinking, not exact numbers):
• Text chunks, vectors and cached outputs all take space. Vectors dominate when they are large (1024 dimensions is roughly 2.5 times the space of 384 dimensions).
• Do not store original uploaded files in the database. Keep files in object storage and store only extracted text and references.
• Store embeddings only for chunks students actually use, and delete or archive old sessions on a schedule.
• Keep the shared content (syllabus, PYQs, question bank) small and compact, since it is the data every user touches.
• Monitor database size from the first week. When the free plan is close to full, upgrade deliberately rather than being surprised.
10. Impact on the build phases
Phase
AI-free work
AI work (kept small)
0 Foundations
Syllabus data, admin panel, question bank and PYQ import, content review flow
None
1 Ingestion
Digital file parsing, cleaning, chunking, full-text search, classic OCR, limits and queue
Open OCR for handwriting, open embeddings
2 Session Study
Syllabus matching by keywords, gap report, study order, progress, extractive summaries, templates
Embedding-based matching, cached AI explanations
3 Quizzes
Bank-driven quizzes, spaced repetition, weak-topic tracker, self-marking
AI marking of written answers, batch-drafted new questions (human reviewed)
4 Exam papers
Blueprint assembly, timer, PDF export, results by topic
None needed, optionally AI-written model answers drafted offline
5 Polish and growth
Quotas, dashboards, fallbacks, contributor leaderboards
Language modes (Bengali, Hinglish), cost tuning
The first usable launch can be almost entirely AI-free: syllabus hub, PYQ statistics, question bank quizzes, paper assembly and calculators. AI then arrives as a premium-feeling layer that can be rationed.
11. Risks specific to this approach
Risk
Mitigation
Question bank too small at launch
Start with one subject, recruit contributors, use AI-drafted and human-reviewed questions
Keyword matching misplaces notes
Show confidence, allow manual correction, add embeddings in Phase 2
Open model quality disappoints
Test on a fixed set of real questions before switching any feature to it
Self-hosted models slow or costly to run
Keep them to embeddings and OCR, avoid live text generation on cheap servers
Contributor content has errors or copyright issues
Review queue, report button, clear rules on what can be uploaded
Neon free storage fills up
Keep files out of the database, prune old data, watch usage weekly
Model and price details change
Re-verify before major decisions and keep model choices behind a thin interface so they can be swapped
12. Recommended order of work
1.  Build the syllabus engine, admin panel and question bank (all AI-free) for one subject.
2.  Add PYQ tagging and statistics, then quizzes and paper assembly. This is already a useful product.
3.  Add ingestion for digital files with keyword search and extractive summaries.
4.  Add open embeddings for better matching and search, and classic plus small open OCR for scans.
5.  Add AI explanations and notes generation using a strong hosted model, with caching to avoid repeat work.
6.  Add AI marking of written answers and Bengali and Hinglish modes, tested against real student work.
7.  Optionally test small open text models on your own question set, and switch a task over only if quality matches.
13. Open questions
• Which subject do we load first, and who will help build its question bank?
• Where will the Express service be hosted, and does that host have enough memory to run an embedding model?
• Do we start with the embedding model in Node, or set up the small Python service immediately?
• How much monthly budget for hosted AI are we comfortable with at the start?
• Which licence terms are acceptable for the models we pick?
14. Decision log
Record decisions here as you make them.
• Stack: Next.js, Express, Neon (decided)
• Embedding model: not decided
• OCR approach: not decided
• Hosted text model for notes: not decided
• First subject: not decided
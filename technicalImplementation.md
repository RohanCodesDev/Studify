MAKAUT AI Study Platform: Phased Technical Plan
A working planning document for the build. It describes what each phase delivers, how it works at a conceptual level, and when a phase counts as done. Code, schemas and syntax are deliberately left out.
1. Product in one paragraph
Students give the platform their own study material (text, PDFs, documents, images), and it turns that material into notes and practice shaped for MAKAUT exams. The core promise is that output follows the university's syllabus and paper pattern instead of being generic AI explanations. The product has four feature pillars: Ingestion, Session Study, Understanding Checks (quizzes), and Chapter Exam Papers.
2. Guiding principles
• Student material first. Answers come from what the student uploaded, and every output points back to its source page or section.
• Exam pattern is the differentiator. Marks-based output (1, 5 and 15 mark styles) is built in, not an afterthought.
• Syllabus is the backbone. Everything is organized by subject, unit and topic.
• Low friction. Mobile-first, fast, and a first try without heavy signup.
• Cost-aware from day one. AI calls are the main expense, so caching and limits are designed in early.
• Honest about accuracy. Wrong answers cost marks, so grounding, source references and a report-an-error path are mandatory.
3. Technology direction
• Language and framework: Node with TypeScript, using Next.js for both the interface and the server logic, so one codebase covers everything.
• Database: PostgreSQL, with vector search added through its built-in extension so no separate vector service is needed at the start.
• File storage: a hosted object store for uploaded files, kept private per user.
• AI layer: a hosted language model API for generation, with a vision-capable model for images and scanned pages. A cheaper model handles routine work like quiz generation.
• Hosting: a free-tier friendly setup for the early stage, built as an installable web app (PWA) for phones.
• Later option: a small separate Python service only if document processing (for example heavy OCR) outgrows what the main stack handles well.
4. How the system fits together
There are five stages that every feature shares:
1.  Intake: the student submits material in any supported form.
2.  Understanding the material: the system extracts text, cleans it, and splits it into meaningful sections.
3.  Organizing: sections are indexed so they can be found by meaning, and mapped to syllabus topics where a syllabus is available.
4.  Generating: the system builds the requested output (notes, quiz, paper) using the relevant sections plus the exam-pattern rules.
5.  Delivering: results are shown in a clean reading view, saved to the student's library, and exportable.
The four pillars are different generators sitting on top of this shared pipeline, which is why the early phases matter most.
Phase 0: Foundations and decisions
Goal: settle the decisions that are expensive to change later, before building features.
What happens
• Choose the first target subject (one that students in your batch find hard, such as DBMS or Operating Systems) and a couple of its chapters for testing.
• Collect the real syllabus for that subject and a handful of recent question papers, and confirm the actual paper structure and marks distribution for the relevant regulation.
• Decide the output styles the product will support (1-mark, 5-mark, 15-mark, last-night revision) and write down what a good answer looks like in each.
• Set up the project, version control, environments, and a place to keep secrets safely.
• Interview 8 to 10 classmates about how they study today and what frustrates them.
Done when: you have one subject's syllabus and papers in hand, a written definition of each output style, and a working empty project deployed somewhere.
Phase 1: Base feature, universal ingestion
Goal: let a person give the system any study material and have it understood reliably. This is the foundation for everything else.
Supported inputs
• Pasted text
• PDFs, both text-based and scanned
• Word documents and presentations
• Images, including photos of handwritten or printed notes
How it works
• Detect and route: the system identifies the file type and chooses the right way to read it.
• Extract: text-based files are read directly. Scanned pages and images go through a vision-capable model that reads the content, including diagrams described in words.
• Clean up: remove repeated headers, page numbers and broken line breaks, and keep the structure (headings, lists, tables) wherever possible.
• Split into sections: break content by headings and topics rather than fixed sizes, so each piece is a coherent idea and can be traced back to a page.
• Index: make each section searchable by meaning, and store its source location.
• Report back: show the student what was understood (a short outline of the detected topics), so they can catch bad reads early.
Design points
• Large files are processed in the background with visible progress, so the interface never feels frozen.
• Every upload belongs to one user and is private by default.
• Limits on file size and count keep costs predictable.
• Failures are explained clearly (unreadable scan, protected file) with a suggested fix.
Basic first output: from any ingested material, the student can already ask for notes on a topic in a chosen style (5-mark or 15-mark). This is the first thing classmates will test.
Done when: a variety of real student files, including a messy scanned one, produce a correct outline and sensible notes that cite their source pages.
Phase 2: Session Study
Goal: the signature feature. The student attaches the official syllabus plus their supporting material, and the system studies the material against the syllabus and teaches in the syllabus pattern.
How a session starts
1.  The student creates a session and names it (for example, "DBMS, Semester 5").
2.  They attach the syllabus (or pick it from a stored library of MAKAUT syllabi as that grows).
3.  They attach supporting material: notes, textbooks, slides, previous papers, handwritten pages.
4.  The system ingests everything using the Phase 1 pipeline.
Syllabus analysis
• Structure the syllabus: convert it into subject, units, topics and, where stated, sub-topics, with any listed weightage or hours.
• Match material to syllabus: link each section of the student's material to the topic it covers.
• Gap report: show the student which syllabus topics are well covered, thin, or missing entirely from their material, and say what extra material they should add.
• Extra content warning: flag material that is not in the syllabus so students don't waste time on it.
• Study order: propose a sequence of topics based on the syllabus order and the student's exam date, if they provide one.
Teaching in syllabus pattern For each syllabus topic the system can produce:
• A plain-language explanation first, then the exam-level version
• Notes in the chosen mark style, with the headings an examiner expects
• Worked examples and diagrams where the topic needs them
• A short summary box for quick revision
• Language options (English, Bengali, Hinglish) for the explanatory part
Session experience
• A chapter-by-chapter progress view, so the student always knows what's done and what's left
• A "teach me this topic" flow that goes section by section instead of dumping everything
• Ability to ask follow-up questions that are answered from the session's own material first
• Everything saved, so returning to a session picks up exactly where it stopped
Handling uncertainty
• If the supporting material doesn't cover a syllabus topic, the system says so and offers to teach it from general knowledge, clearly labelled as not from the student's material.
• Source references appear on every explanation, and a report-an-error button sits beside every output.
Done when: a full chapter of one subject can be studied end to end in a session, the gap report is accurate according to a classmate who knows the subject, and the notes match the syllabus topics.
Phase 3: Understanding checks (quizzes)
Goal: make sure the student actually understood, not just read. Quizzes are optional but closely tied to Session Study.
Question types
• Objective: multiple choice, with believable wrong options, and true/false for quick checks
• Short answer: a few lines, in the style of a 5-mark question
• Long answer: a structured response, in the style of a 15-mark question
How a quiz is built
• Questions come from the student's own material and the syllabus topics, so quizzes cover what will be examined.
• The student chooses the scope (one topic, a chapter, or a whole unit), the types, and the number of questions.
• Difficulty adapts: topics the student gets wrong come back more often, and topics they get right are spaced out.
Marking and feedback
• Objective questions are marked instantly with an explanation of the right answer.
• Written answers are checked against a marking guide the system builds from the source material, covering key points, structure and use of examples. The student gets a score, what they covered, what they missed, and a model answer to compare with.
• The system is clear that AI marking of written answers is a guide, not an examiner's verdict.
Learning loop
• A weak-topic tracker highlights where the student keeps slipping.
• Flashcards are generated from missed points for quick revision.
• A short check at the start of the next study session revisits yesterday's weak spots.
Done when: quizzes of all three types can be generated for a chapter, marking feels fair to test users, and the weak-topic tracker visibly changes what the student is asked next.
Phase 4: Chapter-end exam papers
Goal: once a chapter is completed, produce realistic, exam-ready practice papers in the MAKAUT style so the student can test themselves under exam conditions.
When it unlocks
• After the student finishes a chapter's study flow and its quiz, a "Generate practice paper" option appears.
• A student can also generate papers across several chapters for a unit test or semester revision.
Paper variants (2 to 3 types)
1.  Full-pattern paper: follows the real structure, with objective questions, short answers and long answers in the right marks distribution and a realistic total.
2.  Focused chapter test: a shorter paper on that chapter only, for quick self-testing.
3.  Hard mode or important-questions set: tougher and more application-based questions, or a set built around topics that appear most often in previous years.
How a paper is built
• The blueprint comes from the confirmed marks pattern, including question counts, choice rules and time allowed.
• Questions are drawn from the chapter's topics so coverage is balanced, with no single topic dominating.
• Style mimics real MAKAUT wording (for example "Explain with a suitable diagram" or "Differentiate between...").
• Each paper is accompanied by a marking scheme and model answers, released after the student submits.
Taking and reviewing
• Timed mode with a countdown, or untimed practice mode.
• Answers can be typed or photographed from handwritten sheets, then marked using the same ingestion and marking tools.
• A result summary shows marks by section and by topic, and feeds directly into the weak-topic tracker.
• Papers can be exported as a printable PDF for offline practice.
Quality guardrails
• The system never claims a paper is a real past paper. It is labelled as practice.
• Questions that repeat too closely across generated papers are avoided.
• A report-a-bad-question option feeds improvements back.
Done when: a completed chapter produces all paper types that look believable to a senior student or teacher, and results feed back into the student's progress view.
Phase 5: Polish, launch and growth
Goal: turn a working tool into something people trust and tell friends about.
Product polish
• Library view for all sessions, notes and papers, with search
• PDF export for notes and papers
• Installable mobile experience that works well on weak networks
• Accounts with simple signup, plus a no-signup first try
• Bengali and Hinglish explanation modes polished
Operations
• Usage limits for free users and clear messages when they are reached
• Caching of repeated outputs to cut costs
• Error tracking, basic analytics on which features get used, and cost monitoring
• Backups and the ability to delete a user's data on request
Growth
• Launch with one subject done very well, in batch and college WhatsApp and Telegram groups, timed just before internals or semester exams
• Invite toppers and friends to contribute syllabus structure and verified question sets, with credit
• Publish a visible changelog and respond quickly to feedback
• Expand subject by subject, semester by semester, based on what users ask for
Done when: a stranger can find the tool, try it, and complete a session without help, and the running cost per active student is known and sustainable.
5. Cross-cutting concerns
Accuracy and trust
• Ground every answer in uploaded material first, and label anything that comes from general knowledge.
• Show source pages next to explanations.
• Keep an error-report button everywhere, and review reports regularly.
• Test outputs with people who know the subject before each subject goes live.
Privacy and content rights
• Uploaded files are private to the user by default.
• Shared notes and past papers are opt-in uploads, with a way to take them down.
• Do not publicly host copyrighted textbooks or notes without permission.
• Collect only the personal data that is needed, and explain it plainly.
Cost control
• Cache outputs for repeated topics and styles.
• Use cheaper models for quizzes, flashcards and routine tasks, and stronger ones for long answers and marking.
• Process each uploaded file once and reuse the result.
• Daily limits for free usage, with the numbers tuned from real usage.
Performance and reliability
• Background processing for big files, with clear progress.
• Graceful failure messages and the ability to retry.
• Light pages that load quickly on phones.
Security basics
• Secrets kept out of code and out of version control.
• Careful handling of file uploads (type and size checks).
• Review of any AI-written code for login and file handling before it ships.
6. Risks and how we handle them
Risk
How we handle it
AI gives a wrong or made-up answer
Ground in the student's material, show sources, report-error button, test with subject-aware reviewers
Poor reading of messy scans or handwriting
Show the student what was understood, allow corrections, set honest expectations
Costs grow faster than users
Caching, model tiering, usage limits, cost monitoring from the start
Exam pattern assumptions are wrong
Confirm against recent papers for each regulation in Phase 0 and per subject
Copyright complaints
Private by default, opt-in sharing, no public hosting of protected books
Scope grows too large
One subject first, finish each phase before starting the next
Users don't trust AI marking
Present it as guidance, show the marking criteria, always provide model answers
7. Suggested order and rough timing
Timings assume part-time work alongside college and will shift with your pace.
Phase
Focus
Rough time
0
Foundations and decisions
1 week
1
Universal ingestion and basic notes
2 to 3 weeks
2
Session Study
3 to 4 weeks
3
Quizzes and understanding checks
2 to 3 weeks
4
Chapter-end exam papers
2 to 3 weeks
5
Polish, launch and growth
Ongoing
8. Open questions to settle as we go
• Which subject and chapters do we launch with?
• Which MAKAUT regulation and year do we treat as the reference for paper patterns?
• How much free usage per student can we afford?
• Do we need accounts from the start, or only after the first useful result?
• Which explanation languages come first beyond English?
9. Progress log
Use this section to record decisions and completed phases as the project moves.
• Phase 0: not started
• Phase 1: not started
• Phase 2: not started
• Phase 3: not started
• Phase 4: not started
• Phase 5: not started
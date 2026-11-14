---
name: studify-quiz-and-exam
description: >-
  Use this skill whenever building or testing the question bank, quiz engines, AI marking rubrics,
  spaced repetition (SM-2), PYQ analytics, or MAKAUT exam paper generation.
---

# Studify Quiz & Exam Paper Engine Skill

This skill governs the question bank architecture, quiz generation, adaptive learning loops, and authentic MAKAUT examination paper blueprints.

---

## 1. Question Bank Data Structure

Every question in the bank must contain structured metadata:

```typescript
interface Question {
  id: string;
  subjectId: string;
  unitId: string;
  topicId: string;
  type: "MCQ" | "TRUE_FALSE" | "FILL_BLANK" | "SHORT" | "LONG";
  marks: 1 | 5 | 15;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  pyqDetails?: {
    year: number;
    semester: number;
    regulation: string;
  };
  questionText: string;
  options?: string[]; // 4 options for MCQ
  correctAnswer: string;
  explanation: string;
  rubricChecklist?: string[]; // Required for 5 and 15 mark questions
}
```

---

## 2. MAKAUT Exam Paper Blueprint Engine

MAKAUT semester papers follow a strict, standardized format that our generator must replicate.

### Authentic MAKAUT Structure (70 Marks Total):
- **Group A (Objective):**
  - 10 Multiple Choice Questions (1 mark each = 10 marks).
  - Selected evenly across all units.
- **Group B (Short Answer):**
  - 5 questions provided; student must answer any 3 (3 $\times$ 5 marks = 15 marks).
  - Spread across different units.
- **Group C (Long Answer):**
  - 5 questions provided; student must answer any 3 (3 $\times$ 15 marks = 45 marks).
  - Frequently structured as sub-parts (e.g. 7 + 8 marks or 5 + 5 + 5 marks).

### Supported Paper Modes:
1. **Full Semester Simulation:** 70 Marks, 3-hour timer, complete Group A, B, and C choice rules.
2. **Focused Chapter Test:** 20–30 Marks, 45-minute timer, 1 chapter scope.
3. **Important PYQ Booster:** Curated from topics that appeared most frequently in the past 5–8 years.

---

## 3. PYQ (Previous Year Questions) Intelligence

- Past papers are tagged down to specific syllabus topics.
- **Occurrence Rate Metric:** Calculate topic appearance:
  $$\text{Frequency} = \frac{\text{Years Topic Appeared}}{\text{Total Available Exam Years}}$$
- Display student-facing badges:
  - 🔥 *"Appeared in 6 of last 8 MAKAUT exams"*
  - ⭐ *"High probability 15-mark topic"*
- Blueprints for the *Important PYQ Booster* use this frequency to weight random selection.

---

## 4. Adaptive Spaced Repetition & Weak-Topic Loop

```
[Student Takes Quiz / Paper]
            │
            ▼
   [Score Calculation]
            │
    ┌───────┴────────────────────────┐
    ▼                                ▼
[Correct Answers]             [Missed Answers]
    │                                │
    ▼                                ▼
[Increase Interval (SM-2)]    [Increment Weak Topic Count]
                                     │
                                     ▼
                              [Generate Flashcard]
                                     │
                                     ▼
                        [Re-queue in Tomorrow's Warmup]
```

- **Weak Topic Metric:** Rolling error rate weighted toward recent attempts:
  $$\text{Topic Risk} = \sum_{\text{recent attempts}} (1 - \text{score})$$
- When starting the next Session Study, display a gentle reminder:
  *"Before we start Module 3, let's do a 2-minute recap of BCNF from yesterday."*

---

## 5. Fair AI Marking & Self-Evaluation Rubric

AI marking of written answers must be fair, transparent, and grounded in the question's rubric checklist.

### Evaluation Workflow:
1. Student types their written answer (or uploads photo of handwritten paper).
2. AI grades the submission against the `rubricChecklist`:
   - Award points for each checklist criterion met (e.g. defined term, included formula, mentioned edge-case).
   - Flag key terms that were omitted.
3. Show the student:
   - **Score Awarded** (e.g. 11/15)
   - **Checklist Breakdown** (which criteria were hit and which were missed)
   - **Full Model Answer** for comparison
   - **Notice:** *"AI grading is a study guide and self-check. Actual university evaluations may vary."*

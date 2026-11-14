---
name: studify-session-study
description: >-
  Use this skill whenever working on file ingestion, document chunking, syllabus parsing,
  topic-mapping algorithms, gap reports, and study note generation (1, 5, 15-mark formats).
---

# Studify Session Study & Ingestion Skill

This skill guides the implementation of Studify's signature pillar: taking student material, matching it against the MAKAUT syllabus, identifying gaps, and generating exam-ready notes.

---

## 1. Universal Ingestion Pipeline

```
[Student Upload] ──> [Format Detector]
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
[Digital PDF/Doc]   [Printed Scan]   [Handwritten / Image]
        │                │                │
  (Parsing Lib)     (Classic OCR)    (Small Open OCR / Vision)
        │                │                │
        └────────────────┼────────────────┘
                         ▼
             [Text Cleaning & Normalizing]
                         ▼
            [Heading & Topic Chunking]
        (Tags: Page Number, Section Heading)
                         ▼
          [Postgres FTS + Vector Indexing]
                         ▼
        [Topic Outline Preview for Student]
```

### Chunking Rules:
- Split by **document headings** first, rather than rigid token boundaries.
- Aim for **400–800 tokens** per chunk with ~50-token overlap if a section is lengthy.
- Every chunk must preserve metadata: `fileId`, `pageNumber`, `sectionTitle`, `userId`.

---

## 2. Syllabus Engine Architecture

The syllabus data schema must strictly adhere to the university hierarchy:

```
Department (e.g. CSE / IT / ECE)
 └── Regulation (e.g. 2018 / 2023 New Curriculum)
      └── Semester (1 to 8)
           └── Subject (Code + Name, e.g. PCC-CS501: DBMS)
                └── Unit / Module (e.g. Module 1: Relational Data Model)
                     └── Topic (e.g. ER Diagram, Normalization, 3NF vs BCNF)
                          └── Sub-topics, Weightage, Hours
```

### Matching Algorithm (Hybrid Confidence):
1. **Keyword Overlap:** Calculate TF-IDF or keyword intersection between chunk text and the topic's keyword list.
2. **Embedding Similarity:** Calculate cosine similarity between chunk vector and topic description vector.
3. **Thresholds:**
   - Confidence $\ge 0.75$: Automatically assigned to the topic.
   - Confidence $0.45 - 0.74$: Assigned with "review suggested" tag.
   - Confidence $< 0.45$: Placed in the **"Unsorted Material"** drawer for manual drag-and-drop.

---

## 3. Gap Report Classification

For each syllabus topic, calculate total matched text length and coverage density:
- **Well Covered (Green):** $\ge 2$ comprehensive chunks covering all key terms.
- **Thin (Amber):** Only 1 short chunk or missing key topic terms. The app suggests: *"Consider adding class notes on [Subtopic]."*
- **Missing (Rose):** Zero matched chunks. The app flags: *"This topic is not present in your uploaded material. Would you like a verified AI foundation note?"*
- **Out of Syllabus (Blue/Purple):** Uploaded content that matches no syllabus topic. The app flags: *"This material appears to be outside MAKAUT syllabus guidelines for this subject."*

---

## 4. Exam Notes Generation Standards

MAKAUT examiners evaluate structure, diagrams, and specific keyword coverage. All generated notes must adhere to these exact formats:

### 1-Mark Answers (Objective / Definition):
- Single concise paragraph (1–3 sentences).
- Precise formal definition or mathematical expression.
- Must be memorizable in 30 seconds.

### 5-Mark Answers (Short Note):
- **Headline / Definition:** 1-sentence precise technical definition.
- **Key Concepts:** 3 to 4 bullet points explaining working mechanism or properties.
- **Diagram Description / ASCII / Code:** Clear text representation of the expected diagram or snippet.
- **Example:** One concrete academic example (e.g., in DBMS: Customer-Account relationship).
- **Source Citation:** `[Source: Class Notes, Page 14]`.

### 15-Mark Answers (Comprehensive Long Answer):
- **Introduction & Theoretical Foundation:** Historical or mathematical context.
- **Formal Definitions & Principles:** Clear definitions of all involved terms.
- **Core Mechanism / Step-by-Step Breakdown:** Detailed breakdown with headings and sub-headings.
- **Detailed Diagram / Architecture Representation:** Description of required diagram, labelled nodes, and data flow.
- **Comprehensive Worked Example:** Step-by-step problem solution or execution trace.
- **Comparative Analysis / Advantages vs. Disadvantages:** Clean markdown table (e.g., 3NF vs BCNF).
- **Exam Summary:** 2-sentence wrap-up hitting all grading criteria.

---

## 5. Multilingual Explanations

- Explanations can be toggled into **Bengali** or **Hinglish** (Bengali script or romanized Hindi mix).
- **Constraint:** Technical terms (e.g., "Foreign Key", "Deadlock", "Process Synchronization") must remain in English in parentheses alongside the native explanation.

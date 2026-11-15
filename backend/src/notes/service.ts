import { query } from "../db";
import { generateWithFallback } from "../ai/gateway";

export interface SectionNoteContent {
  oneMark: {
    definition: string;
    keyRule: string;
    quickFact: string;
  };
  fiveMarks: {
    leadDefinition: string;
    corePrinciples: string[];
    diagramLabel: string;
    diagramContent: string;
    academicExample: {
      title: string;
      description: string;
    };
    sourceCitation: string;
  };
  fifteenMarks: {
    theoreticalFoundation: string;
    formalDefinitions: {
      term: string;
      explanation: string;
    }[];
    stepByStepDecomposition: {
      step: number;
      title: string;
      detail: string;
    }[];
    comparisonTable: {
      headers: [string, string, string];
      rows: [string, string, string][];
    };
    diagramLabel: string;
    diagramContent: string;
    workedProblem: {
      relation: string;
      functionalDependencies: string[];
      candidateKeys: string;
      analysis: string;
      conclusion: string;
    };
    sourceCitation: string;
  };
  crashRevision: {
    highYieldPoints: string[];
    makautRepeatAlert: string;
    commonExamMistake: string;
    quickMnemonic: string;
  };
  bilingualExplanation: {
    hinglish: string;
    bengali: string;
  };
}

export interface SectionNotesResult {
  sessionId: string;
  sectionIndex: number;
  sectionTitle: string;
  nextSectionTitle: string | null;
  totalSections: number;
  provider: string;
  isCached: boolean;
  notes: SectionNoteContent;
}

/**
 * Deterministic extractive fallback:
 * Used if AI rate limit or network drops, guaranteeing 0 blank crashes.
 */
function createExtractiveFallback(
  sectionTitle: string,
  chunkText: string,
  pageNumber: number,
  fileName: string
): SectionNoteContent {
  const sentences = chunkText
    .split(/[.!?]\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20);

  const defSentence =
    sentences[0] ||
    `${sectionTitle} is a fundamental concept in the syllabus.`;
  const ruleSentence =
    sentences[1] ||
    `Every condition defined in ${sectionTitle} must be satisfied in relation instances.`;
  const factSentence =
    sentences[2] ||
    `Understanding ${sectionTitle} is essential for semester exam scoring.`;

  return {
    oneMark: {
      definition: defSentence,
      keyRule: ruleSentence,
      quickFact: factSentence,
    },
    fiveMarks: {
      leadDefinition: defSentence,
      corePrinciples: [
        ruleSentence,
        sentences[3] || "Ensures structural consistency across table relations.",
        sentences[4] || "Preserves dependencies while preventing redundant storage.",
        sentences[5] || "Mandatory for solving university marks questions.",
      ],
      diagramLabel: `${sectionTitle} Dependency Diagram`,
      diagramContent: `┌──────────────────────────────────────────────┐\n│  Input Schema R(A, B, C)                      │\n│   └── Applies: ${sectionTitle.slice(0, 30)}         │\n│        └── Normalized Sub-Relations          │\n└──────────────────────────────────────────────┘`,
      academicExample: {
        title: `Example for ${sectionTitle}`,
        description:
          sentences[2] ||
          "Consider relation R(A, B, C) with constraints defined in the course material.",
      },
      sourceCitation: `Extracted from ${fileName}, Page ${pageNumber}`,
    },
    fifteenMarks: {
      theoreticalFoundation: `${defSentence} ${ruleSentence}`,
      formalDefinitions: [
        {
          term: sectionTitle,
          explanation: defSentence,
        },
        {
          term: "Functional Constraint",
          explanation: ruleSentence,
        },
      ],
      stepByStepDecomposition: [
        {
          step: 1,
          title: "Identify Functional Dependencies",
          detail: "Determine the candidate keys and compute attribute closures.",
        },
        {
          step: 2,
          title: `Apply ${sectionTitle} Criteria`,
          detail: "Verify whether each dependency satisfies the required condition.",
        },
        {
          step: 3,
          title: "Verify Lossless Join",
          detail: "Confirm that common attributes form a superkey in the decomposition.",
        },
      ],
      comparisonTable: {
        headers: ["Criteria", "Standard Definition", "Exam Implication"],
        rows: [
          ["Condition", ruleSentence.slice(0, 40), "Strictly verified"],
          ["Preservation", "Lossless Join", "Guaranteed without spurious tuples"],
          ["University Weight", "5 to 15 Marks", "High exam frequency"],
        ],
      },
      diagramLabel: `${sectionTitle} Architecture`,
      diagramContent: `┌──────────────────────────────────────────────┐\n│  Universal Schema Decomposition             │\n│  R1 ∩ R2 -> Superkey Criterion               │\n└──────────────────────────────────────────────┘`,
      workedProblem: {
        relation: "R(A, B, C, D)",
        functionalDependencies: ["A -> B", "B -> C", "C -> D"],
        candidateKeys: "A",
        analysis:
          "Applying standard algorithm to eliminate redundancy step by step.",
        conclusion: `Decomposition achieves ${sectionTitle} without information loss.`,
      },
      sourceCitation: `Extracted from ${fileName}, Page ${pageNumber}`,
    },
    crashRevision: {
      highYieldPoints: [
        defSentence,
        ruleSentence,
        "Never introduce lossy join decompositions without a common superkey.",
      ],
      makautRepeatAlert: `High-frequency topic in recent university examinations for ${sectionTitle}.`,
      commonExamMistake:
        "Confusing 3NF with BCNF requirements regarding prime attribute RHS.",
      quickMnemonic: `Anchor: ${ruleSentence.slice(0, 50)}`,
    },
    bilingualExplanation: {
      hinglish: `${sectionTitle} ka simple matlab hai: ${defSentence} Yeh exam me aksar 5 ya 15 marks me pucha jata hai.`,
      bengali: `${sectionTitle} holo ekti guruttwopurno dharona. ${defSentence}`,
    },
  };
}

/**
 * Fetch or generate section notes on-demand.
 * "Generate texts notes and stuffs according to chapters/sections... on clicking generate the next section"
 */
export async function getOrGenerateSectionNotes(
  sessionId: string,
  sectionIndex: number = 0
): Promise<SectionNotesResult> {
  // 1. Check if section notes are already generated & cached in Neon DB
  const cachedRows = await query(
    `
    SELECT 
      session_id AS "sessionId",
      section_index AS "sectionIndex",
      section_title AS "sectionTitle",
      next_section_title AS "nextSectionTitle",
      total_sections AS "totalSections",
      provider_used AS "providerUsed",
      note_content AS "notes"
    FROM generated_notes
    WHERE session_id = $1 AND section_index = $2;
    `,
    [sessionId, sectionIndex]
  );

  if (cachedRows.length > 0) {
    const row = cachedRows[0];
    console.log(
      `[NotesService] ⚡ Returning cached notes for ${sessionId} section ${sectionIndex} (${row.sectionTitle})`
    );
    return {
      sessionId: row.sessionId,
      sectionIndex: row.sectionIndex,
      sectionTitle: row.sectionTitle,
      nextSectionTitle: row.nextSectionTitle,
      totalSections: row.totalSections,
      provider: row.providerUsed || "neon_cache",
      isCached: true,
      notes: row.notes,
    };
  }

  // 2. Not cached: Retrieve chunks for this session
  const chunks = await query(
    `
    SELECT id, file_name, page_number, section_title, content_text
    FROM document_chunks
    WHERE session_id = $1
    ORDER BY page_number ASC, created_at ASC;
    `,
    [sessionId]
  );

  if (chunks.length === 0) {
    throw new Error(
      `No study chunks found for session '${sessionId}'. Please ingest study material first.`
    );
  }

  // Group chunks into sections based on section_title
  const sectionMap = new Map<string, any[]>();
  for (const c of chunks) {
    const title = c.section_title || "Introduction";
    if (!sectionMap.has(title)) sectionMap.set(title, []);
    sectionMap.get(title)!.push(c);
  }

  const sectionTitles = Array.from(sectionMap.keys());
  const totalSections = sectionTitles.length;

  const validIndex = Math.max(0, Math.min(sectionIndex, totalSections - 1));
  const activeTitle = sectionTitles[validIndex];
  const nextTitle =
    validIndex + 1 < totalSections ? sectionTitles[validIndex + 1] : null;

  const activeChunks = sectionMap.get(activeTitle) || [chunks[0]];
  const combinedChunkText = activeChunks
    .map((c: any) => c.content_text)
    .join("\n\n")
    .slice(0, 4000); // Keep focused to avoid burning tokens
  const sourcePage = activeChunks[0]?.page_number || 1;
  const sourceFile = activeChunks[0]?.file_name || "course_notes.pdf";
  const chunkIds = activeChunks.map((c: any) => c.id).filter(Boolean);

  // 3. Prompt for section synthesis
  const systemPrompt = `You are a specialized MAKAUT Engineering Professor and Exam Evaluator.
Your job is to take an academic study section and synthesize exam-ready notes in JSON format.
You must strictly follow the output schema and ground all facts in the provided text. Never hallucinate.`;

  const userPrompt = `
Generate MAKAUT marks-aligned notes for the syllabus section: "${activeTitle}".
Use the student's source text below:

--- SOURCE TEXT (Page ${sourcePage} of ${sourceFile}) ---
${combinedChunkText}
--------------------------------------------------------

Return ONLY a valid JSON object matching this exact TypeScript structure:
{
  "oneMark": {
    "definition": "Clear 1-2 sentence formal definition",
    "keyRule": "Exact condition or mathematical constraint to remember",
    "quickFact": "High-yield nuance or exam differentiator"
  },
  "fiveMarks": {
    "leadDefinition": "Formal lead paragraph explaining the principle",
    "corePrinciples": ["Principle 1", "Principle 2", "Principle 3", "Principle 4"],
    "diagramLabel": "Architecture or Flow Diagram Label",
    "diagramContent": "Clean ASCII diagram or architectural tree",
    "academicExample": {
      "title": "Worked Academic Example Title",
      "description": "Concrete relation schema and constraint example"
    },
    "sourceCitation": "Source page reference"
  },
  "fifteenMarks": {
    "theoreticalFoundation": "Comprehensive theoretical analysis",
    "formalDefinitions": [
      { "term": "Core Term", "explanation": "Detailed explanation" }
    ],
    "stepByStepDecomposition": [
      { "step": 1, "title": "Step 1 Title", "detail": "Algorithmic detail" },
      { "step": 2, "title": "Step 2 Title", "detail": "Algorithmic detail" }
    ],
    "comparisonTable": {
      "headers": ["Attribute", "Approach A", "Approach B"],
      "rows": [["Criteria 1", "Detail", "Detail"]]
    },
    "diagramLabel": "Comprehensive System Diagram",
    "diagramContent": "Detailed ASCII Architecture",
    "workedProblem": {
      "relation": "R(A, B, C, D)",
      "functionalDependencies": ["FD1", "FD2"],
      "candidateKeys": "Keys",
      "analysis": "Step by step analysis",
      "conclusion": "Final decomposition outcome"
    },
    "sourceCitation": "Source page reference"
  },
  "crashRevision": {
    "highYieldPoints": ["Point 1", "Point 2", "Point 3"],
    "makautRepeatAlert": "Exam pattern note",
    "commonExamMistake": "Typical student error to avoid",
    "quickMnemonic": "Quick memory anchor"
  },
  "bilingualExplanation": {
    "hinglish": "Clear colloquial Hinglish explanation",
    "bengali": "Clear colloquial Bengali conceptual explanation"
  }
}
`;

  let synthesizedNotes: SectionNoteContent;
  let providerUsed = "groq";

  try {
    const aiResponse = await generateWithFallback({
      systemPrompt,
      userPrompt,
      responseFormat: "json",
      temperature: 0.2,
    });

    providerUsed = aiResponse.provider;
    // Sanitize JSON
    const cleanJson = aiResponse.text
      .replace(/^```json\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    synthesizedNotes = JSON.parse(cleanJson);
  } catch (err: any) {
    console.warn(
      `[NotesService] AI synthesis fallback to extractive skeleton for ${activeTitle}:`,
      err.message
    );
    providerUsed = "extractive_fallback";
    synthesizedNotes = createExtractiveFallback(
      activeTitle,
      combinedChunkText,
      sourcePage,
      sourceFile
    );
  }

  // 4. Save to Neon PostgreSQL so subsequent requests cost $0 and load instantly!
  await query(
    `
    INSERT INTO generated_notes (
      session_id,
      section_index,
      section_title,
      next_section_title,
      total_sections,
      source_chunk_ids,
      provider_used,
      note_content
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    ON CONFLICT (session_id, section_index) DO UPDATE SET
      section_title = EXCLUDED.section_title,
      next_section_title = EXCLUDED.next_section_title,
      total_sections = EXCLUDED.total_sections,
      provider_used = EXCLUDED.provider_used,
      note_content = EXCLUDED.note_content,
      updated_at = CURRENT_TIMESTAMP;
    `,
    [
      sessionId,
      validIndex,
      activeTitle,
      nextTitle,
      totalSections,
      chunkIds.length > 0 ? chunkIds : null,
      providerUsed,
      JSON.stringify(synthesizedNotes),
    ]
  );

  return {
    sessionId,
    sectionIndex: validIndex,
    sectionTitle: activeTitle,
    nextSectionTitle: nextTitle,
    totalSections,
    provider: providerUsed,
    isCached: false,
    notes: synthesizedNotes,
  };
}

/**
 * Get section outline for a session
 */
export async function getSessionOutline(sessionId: string) {
  const chunks = await query(
    `
    SELECT DISTINCT section_title
    FROM document_chunks
    WHERE session_id = $1
    ORDER BY section_title ASC;
    `,
    [sessionId]
  );

  const generated = await query(
    `
    SELECT section_index, section_title
    FROM generated_notes
    WHERE session_id = $1
    ORDER BY section_index ASC;
    `,
    [sessionId]
  );

  const generatedSet = new Set(generated.map((g: any) => g.section_index));

  return {
    sessionId,
    totalSections: chunks.length,
    sections: chunks.map((c: any, idx: number) => ({
      index: idx,
      title: c.section_title || `Section ${idx + 1}`,
      isGenerated: generatedSet.has(idx),
    })),
  };
}

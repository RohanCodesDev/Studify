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
      leadDefinition: `${defSentence} ${ruleSentence}`,
      corePrinciples: [
        defSentence,
        ruleSentence,
        factSentence,
        `Understanding ${sectionTitle} is essential for comprehensive exam mastery.`,
      ],
      diagramLabel: `${sectionTitle} Conceptual Architecture`,
      diagramContent: `┌──────────────────────────────────────────────┐\n│  Topic Section: ${sectionTitle.slice(0, 26).padEnd(26)}   │\n│   └── Principle: ${ruleSentence.slice(0, 27).padEnd(27)} │\n└──────────────────────────────────────────────┘`,
      academicExample: {
        title: `Core Context of ${sectionTitle}`,
        description: factSentence,
      },
      sourceCitation: `Source: ${fileName}, Page ${pageNumber}`,
    },
    fifteenMarks: {
      theoreticalFoundation: `${defSentence} ${ruleSentence} ${factSentence}`,
      formalDefinitions: [
        {
          term: sectionTitle,
          explanation: defSentence,
        },
        {
          term: "Governing Constraint",
          explanation: ruleSentence,
        },
      ],
      stepByStepDecomposition: [
        {
          step: 1,
          title: "Foundational Concepts & Scope",
          detail: `Examine the primary definitions and scope of ${sectionTitle}.`,
        },
        {
          step: 2,
          title: "Detailed Criteria & Rules",
          detail: ruleSentence,
        },
        {
          step: 3,
          title: "Key Takeaways & Applications",
          detail: factSentence,
        },
      ],
      comparisonTable: {
        headers: ["Aspect", "Definition & Rules", "Academic Significance"],
        rows: [
          ["Core Focus", defSentence.slice(0, 40), "Fundamental concept"],
          ["Constraint", ruleSentence.slice(0, 40), "Strictly verified"],
          ["Exam Weightage", "5 to 15 Marks", "High syllabus priority"],
        ],
      },
      diagramLabel: `${sectionTitle} Analytical Flow`,
      diagramContent: `┌──────────────────────────────────────────────┐\n│  ${sectionTitle.slice(0, 42).padEnd(42)}  │\n│  Rule: ${ruleSentence.slice(0, 38).padEnd(38)}│\n└──────────────────────────────────────────────┘`,
      workedProblem: {
        relation: `Topic Analysis: ${sectionTitle}`,
        functionalDependencies: [
          ruleSentence.slice(0, 60),
          factSentence.slice(0, 60),
        ],
        candidateKeys: "Key Concepts & Criteria",
        analysis: `Detailed analytical evaluation based on ${fileName} (Page ${pageNumber}).`,
        conclusion: `Validates requirements outlined in ${sectionTitle}.`,
      },
      sourceCitation: `Source: ${fileName}, Page ${pageNumber}`,
    },
    crashRevision: {
      highYieldPoints: [
        defSentence,
        ruleSentence,
        factSentence,
      ],
      makautRepeatAlert: `High-yield topic for revision in ${sectionTitle}.`,
      commonExamMistake: `Overlooking the primary rule: ${ruleSentence.slice(0, 60)}.`,
      quickMnemonic: `Key Rule: ${ruleSentence.slice(0, 50)}`,
    },
    bilingualExplanation: {
      hinglish: `${sectionTitle} ka simple matlab: ${defSentence}`,
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
  const systemPrompt = `You are an expert academic tutor and exam evaluator.
Your job is to take the student's study material section ("${activeTitle}") and synthesize clear, structured, marks-aligned study notes in JSON format.
STRICT GROUNDING RULES:
1. Ground ALL definitions, principles, diagrams, and explanations STRICTLY in the provided source text.
2. NEVER inject unrelated topics. Do NOT mention database normalization, SQL, or BCNF unless the source text explicitly teaches databases.
3. If the material is about transport logistics, heavy machinery, operating systems, mathematics, etc., synthesize notes exclusively about that exact topic.
4. You must strictly output valid JSON matching the requested schema.`;

  const userPrompt = `
Generate structured exam notes for the section: "${activeTitle}".
Use the student's source text below:

--- SOURCE TEXT (Page ${sourcePage} of ${sourceFile}) ---
${combinedChunkText}
--------------------------------------------------------

Return ONLY a valid JSON object matching this exact TypeScript structure:
{
  "oneMark": {
    "definition": "Clear 1-2 sentence formal definition derived from source text",
    "keyRule": "Exact condition, constraint, or equation to remember",
    "quickFact": "High-yield nuance or key differentiator"
  },
  "fiveMarks": {
    "leadDefinition": "Formal lead paragraph explaining the principle",
    "corePrinciples": ["Principle 1", "Principle 2", "Principle 3", "Principle 4"],
    "diagramLabel": "Conceptual Flow or Architecture Diagram Label",
    "diagramContent": "Clean ASCII diagram or hierarchy tree representing this topic",
    "academicExample": {
      "title": "Worked Academic or Practical Example Title",
      "description": "Concrete example grounded in the provided source text"
    },
    "sourceCitation": "Source citation referencing ${sourceFile}"
  },
  "fifteenMarks": {
    "theoreticalFoundation": "Comprehensive theoretical analysis of this section",
    "formalDefinitions": [
      { "term": "Core Term 1", "explanation": "Detailed explanation from text" },
      { "term": "Core Term 2", "explanation": "Detailed explanation from text" }
    ],
    "stepByStepDecomposition": [
      { "step": 1, "title": "Step 1 Title", "detail": "Detailed theoretical or practical step" },
      { "step": 2, "title": "Step 2 Title", "detail": "Detailed theoretical or practical step" }
    ],
    "comparisonTable": {
      "headers": ["Aspect", "Criterion or Detail", "Significance"],
      "rows": [["Criterion 1", "Detail from text", "Significance"]]
    },
    "diagramLabel": "Comprehensive System or Process Diagram",
    "diagramContent": "Detailed ASCII Architecture or Process Map",
    "workedProblem": {
      "relation": "Case Study or Analysis Title",
      "functionalDependencies": ["Core Condition 1", "Core Condition 2"],
      "candidateKeys": "Primary Governing Principle",
      "analysis": "Step by step analytical or quantitative evaluation",
      "conclusion": "Final outcome and key takeaway"
    },
    "sourceCitation": "Source citation referencing ${sourceFile}"
  },
  "crashRevision": {
    "highYieldPoints": ["Key Point 1", "Key Point 2", "Key Point 3"],
    "makautRepeatAlert": "Exam pattern or critical emphasis note",
    "commonExamMistake": "Typical student error to avoid",
    "quickMnemonic": "Quick memory anchor"
  },
  "bilingualExplanation": {
    "hinglish": "Clear colloquial Hinglish conceptual explanation",
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
    // Robustly extract JSON object even if model wraps in backticks or preamble
    let rawText = aiResponse.text.trim();
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    const cleanJson = jsonMatch
      ? jsonMatch[0]
      : rawText.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();

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

export interface ProcessedChunk {
  chunkIndex: number;
  sectionTitle: string;
  pageNumber: number;
  contentText: string;
  tokenCountEstimate: number;
}

export interface ChunkingResult {
  chunks: ProcessedChunk[];
  detectedOutline: string[];
  totalWords: number;
}

// Regex heuristics for detecting syllabus headings in academic notes & PDFs
const HEADING_PATTERNS = [
  // Markdown style: # Heading, ## Subheading
  /^#{1,4}\s+(.+)$/m,
  // Module or Unit pattern: Module 1:, Unit II -
  /^(?:Module|Unit|Chapter|Section)\s+[\dIVXLC]+[:\.\-–]\s*(.+)$/im,
  // Numbered list heading: 1. Introduction to Normalization
  /^\d+\.\s+([A-Z][A-Za-z0-9\s,\-–\(\)\/]{3,60})$/m,
  // All Caps headings: RELATIONAL DATABASE NORMALIZATION
  /^([A-Z0-9\s,\-–\(\)\/]{5,60})$/m,
];

function isHeadingLine(line: string): { isHeading: boolean; title?: string } {
  const trimmed = line.trim();
  if (!trimmed || trimmed.length < 3 || trimmed.length > 80) {
    return { isHeading: false };
  }

  // Common false positives (e.g. standalone numbers, sentences ending in period)
  if (/^[0-9]+$/.test(trimmed)) return { isHeading: false };
  if (trimmed.endsWith(".") && trimmed.split(" ").length > 8) return { isHeading: false };

  for (const pattern of HEADING_PATTERNS) {
    const match = trimmed.match(pattern);
    if (match) {
      const title = (match[1] || match[0]).trim();
      return { isHeading: true, title };
    }
  }

  return { isHeading: false };
}

/**
 * Splits text into syllabus-mapped chunks respecting headings, paragraphs, and token budgets.
 */
export function chunkDocument(
  text: string,
  totalEstimatedPages: number = 1
): ChunkingResult {
  const lines = text.split("\n");
  const sections: { title: string; lines: string[] }[] = [];

  let currentTitle = "Introduction & Overview";
  let currentLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const { isHeading, title } = isHeadingLine(line);

    if (isHeading && title && currentLines.length > 0) {
      sections.push({
        title: currentTitle,
        lines: currentLines,
      });
      currentTitle = title;
      currentLines = [];
    } else {
      currentLines.push(line);
    }
  }

  if (currentLines.length > 0) {
    sections.push({
      title: currentTitle,
      lines: currentLines,
    });
  }

  // Deduplicate and collect detected outline
  const detectedOutline: string[] = [];
  sections.forEach((s) => {
    if (s.title && !detectedOutline.includes(s.title)) {
      detectedOutline.push(s.title);
    }
  });

  const chunks: ProcessedChunk[] = [];
  let chunkCounter = 0;
  let runningCharCount = 0;
  const totalChars = text.length || 1;

  for (const section of sections) {
    const sectionText = section.lines.join("\n").trim();
    if (!sectionText) continue;

    const words = sectionText.split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    // Estimate page number from proportional character position
    runningCharCount += sectionText.length;
    const approximatePage = Math.max(
      1,
      Math.min(
        totalEstimatedPages,
        Math.ceil((runningCharCount / totalChars) * totalEstimatedPages)
      )
    );

    // If section fits comfortably within 400-800 tokens (~300-600 words)
    if (wordCount <= 650) {
      chunks.push({
        chunkIndex: chunkCounter++,
        sectionTitle: section.title,
        pageNumber: approximatePage,
        contentText: sectionText,
        tokenCountEstimate: Math.round(wordCount / 0.75),
      });
    } else {
      // Sub-divide oversized section into paragraph blocks with ~50-word overlap
      const paragraphs = sectionText.split(/\n\s*\n/).filter(Boolean);
      let currentSubChunk: string[] = [];
      let currentSubWords = 0;

      for (const p of paragraphs) {
        const pWords = p.split(/\s+/).filter(Boolean).length;
        if (currentSubWords + pWords > 550 && currentSubChunk.length > 0) {
          const chunkStr = currentSubChunk.join("\n\n");
          chunks.push({
            chunkIndex: chunkCounter++,
            sectionTitle: `${section.title} (Part ${chunks.length + 1})`,
            pageNumber: approximatePage,
            contentText: chunkStr,
            tokenCountEstimate: Math.round(currentSubWords / 0.75),
          });
          currentSubChunk = [p];
          currentSubWords = pWords;
        } else {
          currentSubChunk.push(p);
          currentSubWords += pWords;
        }
      }

      if (currentSubChunk.length > 0) {
        chunks.push({
          chunkIndex: chunkCounter++,
          sectionTitle: section.title,
          pageNumber: approximatePage,
          contentText: currentSubChunk.join("\n\n"),
          tokenCountEstimate: Math.round(currentSubWords / 0.75),
        });
      }
    }
  }

  // Fallback if no chunks were created (e.g. very short text)
  if (chunks.length === 0 && text.trim().length > 0) {
    const words = text.split(/\s+/).length;
    chunks.push({
      chunkIndex: 0,
      sectionTitle: "Course Material Excerpt",
      pageNumber: 1,
      contentText: text.trim(),
      tokenCountEstimate: Math.round(words / 0.75),
    });
    detectedOutline.push("Course Material Excerpt");
  }

  return {
    chunks,
    detectedOutline,
    totalWords: text.split(/\s+/).filter(Boolean).length,
  };
}

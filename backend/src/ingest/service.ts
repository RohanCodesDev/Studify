import { extractFromPdf, extractFromText, ExtractedDocument } from "./extractor";
import { chunkDocument, ChunkingResult, ProcessedChunk } from "./chunker";
import { pool, query } from "../db";

export interface IngestRequestOptions {
  fileBuffer?: Buffer;
  fileName?: string;
  pastedText?: string;
  sessionId?: string;
  subjectCode?: string;
}

export interface IngestResult {
  success: boolean;
  sessionId: string;
  fileName: string;
  sourceType: string;
  pageCount: number;
  totalWords: number;
  totalChunks: number;
  detectedOutline: string[];
  isScannedSuspect: boolean;
  preview: {
    chunkIndex: number;
    sectionTitle: string;
    pageNumber: number;
    snippet: string;
    tokenCount: number;
  }[];
  message: string;
}

export async function processIngestion(options: IngestRequestOptions): Promise<IngestResult> {
  const {
    fileBuffer,
    fileName = "pasted_notes.txt",
    pastedText,
    sessionId = "sess_dbms",
    subjectCode = "PCC-CS501",
  } = options;

  let extraction: ExtractedDocument;

  if (fileBuffer) {
    if (fileName.toLowerCase().endsWith(".pdf")) {
      extraction = await extractFromPdf(fileBuffer);
    } else {
      const textContent = fileBuffer.toString("utf-8");
      extraction = extractFromText(textContent, "text");
    }
  } else if (pastedText && pastedText.trim().length > 0) {
    extraction = extractFromText(pastedText, "pasted");
  } else {
    throw new Error("No file or text content provided for ingestion.");
  }

  // Fail-soft check: empty or near-empty extraction
  if (!extraction.text || extraction.text.trim().length < 15) {
    if (extraction.isScannedSuspect) {
      return {
        success: false,
        sessionId,
        fileName,
        sourceType: extraction.sourceType,
        pageCount: extraction.pageCount,
        totalWords: 0,
        totalChunks: 0,
        detectedOutline: [],
        isScannedSuspect: true,
        preview: [],
        message:
          "This PDF appears to be a scanned image with no selectable text. OCR processing is required.",
      };
    }
    throw new Error("The uploaded file does not contain readable text.");
  }

  // Chunk document by syllabus headings
  const chunkResult: ChunkingResult = chunkDocument(
    extraction.text,
    extraction.pageCount
  );

  // Ensure study session exists in database
  const detectedChapterName =
    chunkResult.detectedOutline[0] ||
    (fileName ? fileName.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ") : "Syllabus Overview");

  await query(
    `
    INSERT INTO study_sessions (id, subject_code, current_chapter_name, progress_percent, topics_covered, total_topics, last_studied)
    VALUES ($1, $2, $3, 15, 1, $4, 'Just now')
    ON CONFLICT (id) DO UPDATE SET
      current_chapter_name = COALESCE(NULLIF($3, ''), study_sessions.current_chapter_name),
      total_topics = GREATEST(study_sessions.total_topics, $4),
      updated_at = CURRENT_TIMESTAMP;
    `,
    [
      sessionId,
      subjectCode,
      detectedChapterName,
      Math.max(1, chunkResult.detectedOutline.length),
    ]
  );

  // Batch insert chunks into Neon PostgreSQL
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    for (const chunk of chunkResult.chunks) {
      await client.query(
        `
        INSERT INTO document_chunks (
          session_id,
          file_name,
          page_number,
          section_title,
          content_text
        )
        VALUES ($1, $2, $3, $4, $5);
        `,
        [
          sessionId,
          fileName,
          chunk.pageNumber,
          chunk.sectionTitle,
          chunk.contentText,
        ]
      );
    }

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }

  // Prepare preview for student UI
  const preview = chunkResult.chunks.slice(0, 3).map((c) => ({
    chunkIndex: c.chunkIndex,
    sectionTitle: c.sectionTitle,
    pageNumber: c.pageNumber,
    snippet:
      c.contentText.length > 180
        ? c.contentText.slice(0, 180).trim() + "..."
        : c.contentText,
    tokenCount: c.tokenCountEstimate,
  }));

  return {
    success: true,
    sessionId,
    fileName,
    sourceType: extraction.sourceType,
    pageCount: extraction.pageCount,
    totalWords: chunkResult.totalWords,
    totalChunks: chunkResult.chunks.length,
    detectedOutline: chunkResult.detectedOutline,
    isScannedSuspect: extraction.isScannedSuspect,
    preview,
    message: `Successfully ingested and mapped ${chunkResult.chunks.length} syllabus chunks.`,
  };
}

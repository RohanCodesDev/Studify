import { Router, Request, Response } from "express";
import multer from "multer";
import { processIngestion } from "./service";
import { query } from "../db";

const router = Router();

// Configure Multer for in-memory processing (max 25MB per file)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024, // 25 MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "application/pdf",
      "text/plain",
      "text/markdown",
      "application/octet-stream", // some txt/md uploaded with octet-stream
    ];
    if (
      allowedMimes.includes(file.mimetype) ||
      file.originalname.match(/\.(pdf|txt|md)$/i)
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF, TXT, and Markdown files are supported."));
    }
  },
});

/**
 * POST /api/ingest
 * Universal ingestion route: accepts multipart PDF/text file OR JSON pasted text
 */
router.post(
  "/",
  upload.single("file"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const file = req.file;
      const { text, sessionId, subjectCode, fileName } = req.body;

      if (!file && (!text || !text.trim())) {
        res.status(400).json({
          success: false,
          error: "Please provide either a study material file (PDF/TXT) or pasted text.",
        });
        return;
      }

      const result = await processIngestion({
        fileBuffer: file?.buffer,
        fileName: file?.originalname || fileName || "pasted_notes.txt",
        pastedText: text,
        sessionId: sessionId || "sess_dbms",
        subjectCode: subjectCode || "PCC-CS501",
      });

      res.status(result.success ? 200 : 422).json(result);
    } catch (err: any) {
      console.error("Ingestion error:", err);
      res.status(500).json({
        success: false,
        error: err.message || "Failed to process and ingest study material.",
      });
    }
  }
);

/**
 * GET /api/ingest/chunks/:sessionId
 * Fetch all stored chunks for a given session from Neon PostgreSQL
 */
router.get("/chunks/:sessionId", async (req: Request, res: Response): Promise<void> => {
  try {
    const { sessionId } = req.params;
    const chunks = await query(
      `
      SELECT 
        id,
        session_id AS "sessionId",
        file_name AS "fileName",
        page_number AS "pageNumber",
        section_title AS "sectionTitle",
        content_text AS "contentText",
        created_at AS "createdAt"
      FROM document_chunks
      WHERE session_id = $1
      ORDER BY page_number ASC, created_at ASC;
      `,
      [sessionId]
    );

    res.json({
      success: true,
      sessionId,
      count: chunks.length,
      chunks,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;

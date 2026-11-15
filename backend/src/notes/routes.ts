import { Router, Request, Response } from "express";
import { getOrGenerateSectionNotes, getSessionOutline } from "./service";

const router = Router();

/**
 * GET /api/notes/:sessionId/section/:sectionIndex
 * Fetch or on-demand generate section notes
 */
router.get("/:sessionId/section/:sectionIndex", async (req: Request, res: Response): Promise<void> => {
  try {
    const { sessionId, sectionIndex } = req.params;
    const indexNum = parseInt(sectionIndex, 10) || 0;

    const result = await getOrGenerateSectionNotes(sessionId, indexNum);
    res.json({ success: true, ...result });
  } catch (err: any) {
    console.error("[NotesRouter] Error:", err);
    res.status(500).json({ success: false, error: err.message || "Failed to generate section notes" });
  }
});

/**
 * GET /api/notes/:sessionId/outline
 * Returns outline of syllabus sections and their generation status
 */
router.get("/:sessionId/outline", async (req: Request, res: Response): Promise<void> => {
  try {
    const { sessionId } = req.params;
    const outline = await getSessionOutline(sessionId);
    res.json({ success: true, ...outline });
  } catch (err: any) {
    console.error("[NotesRouter Outline] Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;

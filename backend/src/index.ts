import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { testConnection, query } from "./db";
import ingestRouter from "./ingest/routes";
import notesRouter from "./notes/routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());

// Ingestion pipeline routes
app.use("/api/ingest", ingestRouter);

// On-demand section notes synthesis routes
app.use("/api/notes", notesRouter);

// Basic health check route
app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    service: "studify-backend",
    timestamp: new Date().toISOString(),
    version: "0.1.0",
  });
});

// Database health check route
app.get("/api/health/db", async (req: Request, res: Response) => {
  const dbHealth = await testConnection();
  if (dbHealth.ok) {
    res.json({
      status: "connected",
      database: "Neon PostgreSQL",
      version: dbHealth.version,
    });
  } else {
    res.status(500).json({
      status: "error",
      error: dbHealth.error,
    });
  }
});

// Get all active study sessions
app.get("/api/sessions", async (req: Request, res: Response) => {
  try {
    const sessions = await query(`
      SELECT 
        s.id,
        s.subject_code AS "code",
        s.subject_code AS "subjectCode",
        COALESCE(sub.name, 'Database Management Systems') AS "name",
        COALESCE(sub.name, 'Database Management Systems') AS "subjectName",
        COALESCE('Semester ' || sub.semester || ' · ' || sub.department_code, 'Semester 5 · CSE') AS "semester",
        COALESCE(s.current_chapter_name, 'Module 3: Normalization') AS "chapter",
        COALESCE(s.current_chapter_name, 'Module 3: Normalization') AS "currentChapter",
        s.progress_percent AS "progressPercent",
        s.topics_covered AS "topicsReady",
        s.topics_covered AS "topicsCovered",
        s.total_topics AS "totalTopics",
        COALESCE(s.last_studied, 'Recently') AS "lastStudied",
        COALESCE(s.last_studied, 'Recently') AS "lastActive"
      FROM study_sessions s
      LEFT JOIN subjects sub ON s.subject_code = sub.code
      ORDER BY s.updated_at DESC;
    `);
    res.json({ success: true, sessions });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get single study session by id
app.get("/api/sessions/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const rows = await query(`
      SELECT 
        s.id,
        s.subject_code AS "code",
        s.subject_code AS "subjectCode",
        COALESCE(sub.name, 'Uploaded Study Notes') AS "name",
        COALESCE(sub.name, 'Uploaded Study Notes') AS "subjectName",
        COALESCE('Semester ' || sub.semester || ' · ' || sub.department_code, 'Study Material') AS "semester",
        COALESCE(s.current_chapter_name, 'Module Overview') AS "chapter",
        COALESCE(s.current_chapter_name, 'Module Overview') AS "currentChapter",
        s.progress_percent AS "progressPercent",
        s.topics_covered AS "topicsCovered",
        s.total_topics AS "totalTopics",
        COALESCE(s.last_studied, 'Recently') AS "lastActive"
      FROM study_sessions s
      LEFT JOIN subjects sub ON s.subject_code = sub.code
      WHERE s.id = $1
      LIMIT 1;
    `, [id]);

    if (rows.length === 0) {
      res.status(404).json({ success: false, error: "Session not found" });
      return;
    }

    res.json({ success: true, session: rows[0] });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update session study progress & touch active timestamp
app.patch("/api/sessions/:id/progress", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { progressPercent, topicsCovered, chapterName } = req.body;

    await query(`
      UPDATE study_sessions
      SET 
        progress_percent = COALESCE($2, progress_percent),
        topics_covered = COALESCE($3, topics_covered),
        current_chapter_name = COALESCE(NULLIF($4, ''), current_chapter_name),
        last_studied = 'Just now',
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1;
    `, [id, progressPercent, topicsCovered, chapterName]);

    res.json({ success: true, message: "Session progress updated" });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get adaptive quiz questions for a module
app.get("/api/quiz/:quizId", async (req: Request, res: Response) => {
  try {
    const { quizId } = req.params;
    let subjectCode = "PCC-CS501";
    let moduleNumber = 3;

    if (quizId.toLowerCase().includes("os")) {
      subjectCode = "PCC-CS502";
      moduleNumber = 2;
    }

    const questions = await query(`
      SELECT 
        id,
        subject_code AS "subjectCode",
        module_number AS "moduleNumber",
        marks_category AS "marks",
        question_text AS "questionText",
        options,
        correct_answer AS "correctAnswer",
        explanation,
        pyq_years AS "pyqYears"
      FROM question_bank
      WHERE subject_code = $1 AND module_number = $2 AND marks_category = 1
      ORDER BY id ASC;
    `, [subjectCode, moduleNumber]);

    res.json({
      success: true,
      quizId,
      count: questions.length,
      questions,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Studify Express Backend running on port ${PORT}`);
});

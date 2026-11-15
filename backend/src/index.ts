import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { testConnection, query } from "./db";
import ingestRouter from "./ingest/routes";

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
        s.subject_code AS "subjectCode",
        sub.name AS "subjectName",
        s.current_chapter_name AS "currentChapter",
        s.progress_percent AS "progressPercent",
        s.topics_covered AS "topicsCovered",
        s.total_topics AS "totalTopics",
        s.last_studied AS "lastActive"
      FROM study_sessions s
      LEFT JOIN subjects sub ON s.subject_code = sub.code
      ORDER BY s.updated_at DESC;
    `);
    res.json({ success: true, sessions });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Studify Express Backend running on port ${PORT}`);
});

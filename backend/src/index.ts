import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

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

// Basic health check route
app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    service: "studify-backend",
    timestamp: new Date().toISOString(),
    version: "0.1.0",
  });
});

app.listen(PORT, () => {
  console.log(`Studify Express Backend running on port ${PORT}`);
});

import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn("⚠️ Warning: DATABASE_URL is not defined in environment variables.");
}

export const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  // Log long queries if needed in dev
  if (duration > 1000) {
    console.warn(`🐢 Slow query (${duration}ms): ${text.slice(0, 100)}`);
  }
  return res.rows as T[];
}

export async function testConnection(): Promise<{ ok: boolean; version?: string; error?: string }> {
  try {
    const res = await pool.query("SELECT version(), current_database() as db_name, now() as current_time;");
    return {
      ok: true,
      version: res.rows[0].version,
    };
  } catch (err: any) {
    return {
      ok: false,
      error: err.message,
    };
  }
}

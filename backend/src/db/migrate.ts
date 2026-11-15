import fs from "fs";
import path from "path";
import { pool } from "./index";

async function runMigration() {
  console.log("Running Studify PostgreSQL database migration on Neon...");
  const schemaPath = path.resolve(__dirname, "schema.sql");
  const sql = fs.readFileSync(schemaPath, "utf-8");

  try {
    await pool.query(sql);
    console.log(" Database schema migrated and seeded successfully!");

    // Verify tables
    const res = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    console.log("📋 Public tables created:");
    res.rows.forEach((row) => console.log(`  - ${row.table_name}`));
  } catch (err) {
    console.error("❌ Migration failed:", err);
  } finally {
    await pool.end();
  }
}

runMigration();

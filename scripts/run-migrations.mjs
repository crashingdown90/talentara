/**
 * Script to run all SQL migrations against Supabase database
 * Usage: node scripts/run-migrations.mjs
 */

import pg from "pg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set.");
  console.error("Set it in your .env file or pass it directly:");
  console.error("  DATABASE_URL=postgresql://... node scripts/run-migrations.mjs");
  process.exit(1);
}

const MIGRATIONS_DIR = path.join(__dirname, "..", "supabase", "migrations");

async function runMigrations() {
  const client = new pg.Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log("🔌 Connecting to Supabase database...");
    await client.connect();
    console.log("✅ Connected!\n");

    // Get all migration files sorted
    const files = fs
      .readdirSync(MIGRATIONS_DIR)
      .filter((f) => f.endsWith(".sql"))
      .sort();

    console.log(`📂 Found ${files.length} migration files\n`);

    for (const file of files) {
      const filePath = path.join(MIGRATIONS_DIR, file);
      const sql = fs.readFileSync(filePath, "utf-8");

      console.log(`⏳ Running: ${file}`);
      try {
        await client.query(sql);
        console.log(`✅ Success: ${file}`);
      } catch (err) {
        console.error(`❌ Error in ${file}: ${err.message}`);
        // Continue with next migration instead of stopping
        // Some migrations may fail if tables already exist
      }
    }

    console.log("\n🎉 All migrations completed!");
  } catch (err) {
    console.error("❌ Connection error:", err.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log("🔌 Disconnected.");
  }
}

runMigrations();

const fs = require("fs");
const path = require("path");
const pool = require("../config/db");

const MIGRATIONS_DIR = path.join(__dirname, "../../migrations");

async function runMigration(file) {
  const fullPath = path.join(MIGRATIONS_DIR, file);
  const sql = fs.readFileSync(fullPath, "utf-8");
  console.log(`🔄 Running ${file}`);
  await pool.query(sql);
}

async function initDb() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const migrationFiles = fs.readdirSync(MIGRATIONS_DIR).sort();

    for (const file of migrationFiles) {
      await runMigration(file);
    }

    await client.query("COMMIT");
    console.log("✅ Database initialized with migrations");
    process.exit(0);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Migration error:", err);
    process.exit(1);
  } finally {
    client.release();
  }
}

initDb();

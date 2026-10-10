import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import pg from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("\n❌ Error: DATABASE_URL is not set.");
  console.error("Please add your PostgreSQL / Neon connection string to .env (or .env.local) and make sure to save the file (Ctrl+S / Cmd+S).\n");
  process.exit(1);
}

console.log("Connecting to database and applying migrations...");

const pool = new pg.Pool({
  connectionString,
  ssl: connectionString.includes("sslmode=require") || connectionString.includes("neon.tech")
    ? { rejectUnauthorized: false }
    : undefined,
});

const db = drizzle(pool);

try {
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("✅ Database migrations applied successfully!");
} catch (error) {
  console.error("❌ Migration failed:", error.message || error);
  process.exit(1);
} finally {
  await pool.end();
}

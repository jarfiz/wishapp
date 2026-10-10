import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-serverless";
import { Pool } from "pg";
import { Pool as NeonPool } from "@neondatabase/serverless";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

function createDb() {
  if (!connectionString) {
    // When no DATABASE_URL is configured, create a dummy or in-memory pool
    // to prevent build-time crashes and allow clear runtime warnings.
    const fallbackPool = new Pool({
      connectionString: "postgresql://postgres:postgres@localhost:5432/daymark",
    });
    return drizzlePg(fallbackPool, { schema });
  }

  // If using Neon serverless
  if (connectionString.includes("neon.tech")) {
    const neonPool = new NeonPool({ connectionString });
    return drizzleNeon(neonPool, { schema });
  }

  // Standard PostgreSQL connection pool
  const pgPool = new Pool({ connectionString });
  return drizzlePg(pgPool, { schema });
}

export const db = createDb();
export * from "./schema";

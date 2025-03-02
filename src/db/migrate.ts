import { migrate } from "drizzle-kit";

// Initialize database migration
async function runMigration() {
  try {
    console.log("Running migrations...");
    
    await migrate(drizzleConfig, {
      migrationsFolder: "./drizzle"
    });
    
    console.log("Migrations completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  }
}

const drizzleConfig = {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  driver: "mysql2",
  dbCredentials: {
    host: Deno.env.get("DB_HOST") || "localhost",
    port: Number(Deno.env.get("DB_PORT")) || 3306,
    user: Deno.env.get("DB_USER") || "root",
    password: Deno.env.get("DB_PASSWORD") || "password",
    database: Deno.env.get("DB_NAME") || "auth_system"
  }
};

// Run migration
await runMigration();
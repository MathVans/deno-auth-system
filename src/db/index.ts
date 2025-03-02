import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "./schema.ts";

// Database connection configuration
const connectionConfig = {
  host: Deno.env.get("DB_HOST") || "localhost",
  port: Number(Deno.env.get("DB_PORT")) || 3306,
  user: Deno.env.get("DB_USER") || "root",
  password: Deno.env.get("DB_PASSWORD") || "password",
  database: Deno.env.get("DB_NAME") || "auth_system"
};

// Create connection pool
const pool = mysql.createPool(connectionConfig);

// Initialize Drizzle with MySQL connection
export const db = drizzle(pool, { schema, mode: "default" });

console.log("Database connection initialized");
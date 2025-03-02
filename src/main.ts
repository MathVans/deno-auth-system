import { Hono } from "hono";
import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { HTTPException } from "hono/http-exception";
import authRoutes from "./routes/auth.ts";
import protectedRoutes from "./routes/protected.ts";

// Initialize app
const app = new Hono();
const api = new OpenAPIHono();

// Apply global middleware
app.use("*", logger());
app.use("*", cors());

// Error handling middleware
app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json({
      success: false,
      message: err.message
    }, err.status);
  }

  console.error("Unhandled error:", err);
  return c.json({
    success: false,
    message: "Internal Server Error"
  }, 500);
});

// API routes
api.route("/auth", authRoutes);
api.route("/protected", protectedRoutes);

// OpenAPI documentation setup
api.doc("openapi", {
  openapi: "3.0.0",
  info: {
    title: "Auth System API",
    version: "1.0.0",
    description: "API para sistema de autenticação básica com Deno.js, Drizzle ORM e MySQL",
    contact: {
      name: "MathVans",
      url: "https://github.com/MathVans"
    }
  },
  components: {
    securitySchemes: {
      Bearer: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    }
  }
});

// Home route
app.get("/", (c) => {
  return c.json({
    message: "Auth System API with MySQL",
    documentation: "/swagger",
    author: "MathVans",
    date: "2025-03-02 17:18:01"
  });
});

// Swagger UI
app.get("/swagger", swaggerUI({ url: "/api/openapi" }));

// Mount the API router
app.route("/api", api);

// Start server
const PORT = 8000;
console.log(`Server running on http://localhost:${PORT}`);
console.log(`API Documentation: http://localhost:${PORT}/swagger`);

Deno.serve({ port: PORT }, app.fetch);
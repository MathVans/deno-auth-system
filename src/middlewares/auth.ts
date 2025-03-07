import { Context } from "hono";
import { verifyToken } from "../utils/jwt.ts";
import { HTTPException } from "hono/http-exception";

/**
 * Middleware para verificar autenticação via JWT
 */
export async function authMiddleware(c: Context, next: () => Promise<void>) {
  const authHeader = c.req.header("Authorization");
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new HTTPException(401, { message: "Authentication required" });
  }

  const token = authHeader.split(" ")[1];
  const payload = await verifyToken(token);
  
  if (!payload || !payload.id) {
    throw new HTTPException(401, { message: "Invalid or expired token" });
  }

  // Adiciona o usuário ao contexto
  c.set("user", payload);
  await next();
}
import { create, verify } from "djwt";

// In a real app, you would use environment variables for this
const JWT_SECRET = new TextEncoder().encode("seu_segredo_super_seguro");

export interface Payload {
  id: number;
  username: string;
  exp?: number;
}

export async function createToken(payload: Payload): Promise<string> {
  // Token valid for 1 hour
  payload.exp = Math.floor(Date.now() / 1000) + 60 * 60;
  return await create({ alg: "HS256", typ: "JWT" }, payload, JWT_SECRET);
}

export async function verifyToken(token: string): Promise<Payload | null> {
  try {
    return await verify(token, JWT_SECRET) as Payload;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}
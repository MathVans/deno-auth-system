import { create, verify, getNumericDate } from "djwt";

// ATENÇÃO: Em um ambiente de produção, use variáveis de ambiente
// Gere uma chave aleatória forte para produção
const secretKey = Deno.env.get("JWT_SECRET") || "sua_chave_secreta_deve_ser_longa_e_randomica";
const JWT_SECRET_BYTES = new TextEncoder().encode(secretKey);
// Create a CryptoKey from the secret
const JWT_SECRET = await crypto.subtle.importKey(
  "raw",
  JWT_SECRET_BYTES,
  { name: "HMAC", hash: "SHA-256" },
  true,
  ["sign", "verify"]
);

export interface JWTPayload {
  id: number;
  username: string;
  exp?: number;
  iat?: number;
}

/**
 * Cria um token JWT para o usuário
 * @param payload Dados a serem incluídos no token
 * @param expiresIn Tempo de expiração em segundos (padrão: 1 hora)
 */
export async function createToken(
  payload: Omit<JWTPayload, "exp" | "iat">, 
  expiresIn = 3600
): Promise<string> {
  const now = Date.now() / 1000;
  
  const jwtPayload: JWTPayload = {
    ...payload,
    iat: getNumericDate(now),
    exp: getNumericDate(now + expiresIn)
  };
  
  try {
    return await create({ alg: "HS256", typ: "JWT" }, jwtPayload, JWT_SECRET);
  } catch (error) {
    console.error("Error creating JWT token:", error);
    throw new Error("Failed to generate authentication token");
  }
}

/**
 * Verifica e decodifica um token JWT
 * @param token Token JWT a ser verificado
 * @returns Payload decodificado ou null se inválido
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const payload = await verify(token, JWT_SECRET);
    return payload as unknown as JWTPayload;
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return null;
  }
}
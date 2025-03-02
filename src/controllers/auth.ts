import { Context } from "hono";
import { db } from "../db/index.ts";
import { users } from "../db/schema.ts";
import { eq } from "drizzle-orm";
import { hashPassword, verifyPassword } from "../utils/password.ts";
import { createToken } from "../utils/jwt.ts";
import { LoginInput, RegisterInput } from "../schemas/auth.ts";
import { HTTPException } from "hono/http-exception";

export async function register(c: Context) {
  const data = await c.req.json<RegisterInput>();
  const { username, email, password } = data;

  try {
    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: (users) => eq(users.username, username) || eq(users.email, email)
    });

    if (existingUser) {
      throw new HTTPException(409, { 
        message: "Username or email already exists"
      });
    }

    // Hash password and create user
    const passwordHash = await hashPassword(password);
    
    const result = await db.insert(users).values({
      username,
      email,
      passwordHash
    });
    
    const userId = Number(result.insertId);
    
    // Generate JWT token
    const token = await createToken({
      id: userId,
      username: username
    });

    return c.json({
      success: true,
      message: "User registered successfully",
      data: { id: userId, username: username },
      token
    }, 201);
  } catch (error) {
    if (error instanceof HTTPException) {
      throw error;
    }
    
    console.error("Registration error:", error);
    throw new HTTPException(500, { 
      message: "Failed to register user"
    });
  }
}

export async function login(c: Context) {
  const data = await c.req.json<LoginInput>();
  const { username, password } = data;

  try {
    // Find user
    const user = await db.query.users.findFirst({
      where: (users) => eq(users.username, username)
    });

    if (!user) {
      throw new HTTPException(401, { 
        message: "Invalid username or password"
      });
    }

    // Verify password
    const validPassword = await verifyPassword(password, user.passwordHash);
    if (!validPassword) {
      throw new HTTPException(401, { 
        message: "Invalid username or password"
      });
    }

    // Generate JWT token
    const token = await createToken({
      id: user.id,
      username: user.username
    });

    return c.json({
      success: true,
      message: "Login successful",
      data: { id: user.id, username: user.username },
      token
    });
  } catch (error) {
    if (error instanceof HTTPException) {
      throw error;
    }
    
    console.error("Login error:", error);
    throw new HTTPException(500, { 
      message: "Failed to log in"
    });
  }
}

export const getProfile = async (c: Context) => {
  try {
    const userId = c.req.param("id");
    const profile = await getUserProfile(userId);

    if (!profile) {
      return c.json({
        message: "User not found",
        success: false,
      }, 404);
    }

    return c.json({
      data: {
        id: profile.id,
        username: profile.username,
        email: profile.email,
        createdAt: profile.createdAt,
      },
      success: true,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return c.json({
      message: "Internal Server Error",
      success: false,
    }, 500);
  }
};
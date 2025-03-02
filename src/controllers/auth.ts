import { db } from "../db/index.ts";
import { users } from "../db/schema.ts";
import { eq } from "drizzle-orm";
import { hashPassword, verifyPassword } from "../utils/password.ts";
import { createToken, JWTPayload } from "../utils/jwt.ts";

export interface RegisterUserInput {
  username: string;
  email: string;
  password: string;
}

export interface LoginUserInput {
  username: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  message: string;
  data?: {
    id: number;
    username: string;
    email?: string;
    createdAt?: Date;
  };
  token?: string;
}

export class AuthService {
  /**
   * Registra um novo usuário no sistema
   */
  async registerUser(input: RegisterUserInput): Promise<AuthResult> {
    const { username, email, password } = input;

    // Verificar se o usuário já existe
    const existingUser = await db.query.users.findFirst({
      where: (users) => eq(users.username, username) || eq(users.email, email)
    });

    if (existingUser) {
      return {
        success: false,
        message: "Username or email already exists"
      };
    }

    // Hash da senha e criação do usuário
    const passwordHash = await hashPassword(password);
    
    try {
      const result = await db.insert(users).values({
        username,
        email,
        passwordHash
      });
      
      const userId = Number(result.insertId);
      
      // Gerar token JWT
      const token = await createToken({
        id: userId,
        username: username
      });

      return {
        success: true,
        message: "User registered successfully",
        data: { id: userId, username },
        token
      };
    } catch (error) {
      console.error("User registration error:", error);
      throw new Error("Failed to register user");
    }
  }

  /**
   * Autentica um usuário existente
   */
  async loginUser(input: LoginUserInput): Promise<AuthResult> {
    const { username, password } = input;

    // Buscar usuário
    const user = await db.query.users.findFirst({
      where: (users) => eq(users.username, username)
    });

    if (!user) {
      return {
        success: false,
        message: "Invalid username or password"
      };
    }

    // Verificar senha
    const validPassword = await verifyPassword(password, user.passwordHash);
    if (!validPassword) {
      return {
        success: false,
        message: "Invalid username or password"
      };
    }

    // Gerar token JWT
    const token = await createToken({
      id: user.id,
      username: user.username
    });

    return {
      success: true,
      message: "Login successful",
      data: { id: user.id, username: user.username },
      token
    };
  }

  /**
   * Busca o perfil de um usuário
   */
  async getUserProfile(userId: number): Promise<AuthResult> {
    const user = await db.query.users.findFirst({
      where: (users) => eq(users.id, userId),
      columns: {
        id: true,
        username: true,
        email: true,
        createdAt: true
      }
    });

    if (!user) {
      return {
        success: false,
        message: "User not found"
      };
    }

    return {
      success: true,
      message: "Profile retrieved successfully",
      data: user
    };
  }
}

// Export singleton instance
export const authService = new AuthService();
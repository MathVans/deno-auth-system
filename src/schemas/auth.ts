import { z } from "zod";
import { createRoute, OpenAPIHono } from "@hono/zod-openapi";

// Schema for registration
export const registerSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email(),
  password: z.string().min(6)
});

export type RegisterInput = z.infer<typeof registerSchema>;

// Schema for login
export const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1)
});

export type LoginInput = z.infer<typeof loginSchema>;

// Response schema for user data 
export const userResponseSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().optional()
});

// Response schema for auth operations
export const authResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: userResponseSchema.optional(),
  token: z.string().optional()
});

// Response schema for errors
export const errorResponseSchema = z.object({
  success: z.boolean().default(false),
  message: z.string(),
  errors: z.record(z.string()).optional()
});

// Profile response schema
export const profileResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    id: z.number(),
    username: z.string(),
    email: z.string(),
    createdAt: z.string()
  })
});

// OpenAPI routes
export const registerRoute = createRoute({
  method: "post",
  path: "/register",
  request: {
    body: {
      content: {
        "application/json": {
          schema: registerSchema
        }
      }
    }
  },
  responses: {
    201: {
      content: {
        "application/json": {
          schema: authResponseSchema
        }
      },
      description: "User registered successfully"
    },
    400: {
      content: {
        "application/json": {
          schema: errorResponseSchema
        }
      },
      description: "Invalid input data"
    },
    409: {
      content: {
        "application/json": {
          schema: errorResponseSchema
        }
      },
      description: "Username or email already exists"
    }
  }
});

export const loginRoute = createRoute({
  method: "post",
  path: "/login",
  request: {
    body: {
      content: {
        "application/json": {
          schema: loginSchema
        }
      }
    }
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: authResponseSchema
        }
      },
      description: "Login successful"
    },
    400: {
      content: {
        "application/json": {
          schema: errorResponseSchema
        }
      },
      description: "Invalid input data"
    },
    401: {
      content: {
        "application/json": {
          schema: errorResponseSchema
        }
      },
      description: "Invalid username or password"
    }
  }
});

export const profileRoute = createRoute({
  method: "get",
  path: "/profile",
  security: [{ Bearer: [] }],
  responses: {
    200: {
      content: {
        "application/json": {
          schema: profileResponseSchema
        }
      },
      description: "User profile"
    },
    401: {
      content: {
        "application/json": {
          schema: errorResponseSchema
        }
      },
      description: "Authentication required"
    }
  }
});
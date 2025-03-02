import { OpenAPIHono } from "@hono/zod-openapi";
import { register, login } from "../controllers/auth.ts";
import { loginRoute, registerRoute } from "../schemas/auth.ts";

// Create a new router for authentication routes
const authRouter = new OpenAPIHono();

authRouter
  .openapi(registerRoute, register)
  .openapi(loginRoute, login);

export default authRouter;
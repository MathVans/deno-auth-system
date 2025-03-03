import { OpenAPIHono } from "@hono/zod-openapi";
import { authMiddleware } from "../middlewares/auth.ts";
import { aut } from "../controllers/auth.ts";
import { profileRoute } from "../schemas/auth.ts";

// Create a new router for protected routes
const protectedRouter = new OpenAPIHono();

// Apply the authentication middleware to all routes in this router
protectedRouter.use("*", authMiddleware);

// Define protected routes
protectedRouter.openapi(profileRoute, getProfile);

export default protectedRouter;
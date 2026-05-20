import { Router } from "express";
import { registerSchema } from "./schemas/register.schema";
import { loginSchema } from "./schemas/login.schema";
import { asyncHandler } from "../../shared/middlewares/async-handler.middleware";
import { validate } from "../../shared/middlewares/validate.middleware";
import { AuthController } from "./controllers/auth.controllers";
import { authMiddleware } from "./middlewares/auth.middleware";

export class AuthRoutes {
  public static get routes(): Router {
    const router = Router();
    const authController = new AuthController();

    router.post(
      '/login',
      validate(loginSchema),
      asyncHandler(authController.login),
    );

    router.post(
      '/register',
      authMiddleware,
      validate(registerSchema),
      asyncHandler(authController.register),
    );

    return router;
  }
}

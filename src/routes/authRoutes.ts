import { Router } from "express";
import { register, login, getMe } from "../controllers/authController";
import { protect } from "../middlewares/authMiddleware";
import { validateRequest } from "../middlewares/validationMiddleware";
import { registerSchema, loginSchema } from "../validators/authValidators";

const router = Router();

// Public routes
router.post("/register", validateRequest(registerSchema), register);
router.post("/login", validateRequest(loginSchema), login);

// Protected routes
router.get("/me", protect, getMe);

export default router;

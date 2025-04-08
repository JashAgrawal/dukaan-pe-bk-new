import { Router } from "express";
import {
  requestOtp,
  verifyOtp,
  resendOtp,
  getMe,
} from "../controllers/authController";
import { protect } from "../middlewares/authMiddleware";
import { validateRequest } from "../middlewares/validationMiddleware";
import {
  requestOtpSchema,
  verifyOtpSchema,
  resendOtpSchema,
} from "../validators/authValidators";

const router = Router();

// Public routes
router.post("/request-otp", validateRequest(requestOtpSchema), requestOtp);
router.post("/verify-otp", validateRequest(verifyOtpSchema), verifyOtp);
router.post("/resend-otp", validateRequest(resendOtpSchema), resendOtp);

// Protected routes
router.get("/me", protect, getMe);

export default router;

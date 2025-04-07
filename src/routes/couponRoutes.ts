import { Router } from "express";
import {
  createCoupon,
  getCoupons,
  getCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
} from "../controllers/couponController";
import { protect } from "../middlewares/authMiddleware";
import { validateRequest } from "../middlewares/validationMiddleware";
import { couponSchema, couponUpdateSchema } from "../validators/couponValidators";

const router = Router();

// Public routes
router.get("/validate/:code", validateCoupon);

// Protected routes
router.use(protect);

router.post("/", validateRequest(couponSchema), createCoupon);
router.get("/", getCoupons);
router.get("/:id", getCoupon);
router.patch("/:id", validateRequest(couponUpdateSchema), updateCoupon);
router.delete("/:id", deleteCoupon);

export default router;

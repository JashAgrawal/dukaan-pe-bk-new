import { Router } from "express";
import {
  createCoupon,
  getCoupons,
  getCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
  getAvailableCoupons,
  validateCouponForCart,
} from "../controllers/couponController";
import { protect } from "../middlewares/authMiddleware";
import { validateRequest } from "../middlewares/validationMiddleware";
import {
  couponSchema,
  couponUpdateSchema,
  availableCouponsSchema,
  validateCouponSchema
} from "../validators/couponValidators";

const router = Router();

// Public routes
router.get("/validate/:code", validateCoupon);

// Protected routes
router.use(protect);

// New endpoints for available coupons and coupon validation
router.get("/available", validateRequest(availableCouponsSchema, "query"), getAvailableCoupons);
router.post("/validate", validateRequest(validateCouponSchema), validateCouponForCart);

// Admin routes for coupon management
router.post("/", validateRequest(couponSchema), createCoupon);
router.get("/", getCoupons);
router.get("/:id", getCoupon);
router.patch("/:id", validateRequest(couponUpdateSchema), updateCoupon);
router.delete("/:id", deleteCoupon);

export default router;

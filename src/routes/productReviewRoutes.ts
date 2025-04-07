import { Router } from "express";
import {
  createProductReview,
  getProductReviews,
  getProductReview,
  updateProductReview,
  deleteProductReview,
  getUserProductReviews,
  restoreProductReview,
} from "../controllers/productReviewController";
import { protect, restrictTo } from "../middlewares/authMiddleware";
import { validateRequest } from "../middlewares/validationMiddleware";
import { 
  productReviewSchema, 
  productReviewUpdateSchema 
} from "../validators/productReviewValidators";

const router = Router();

// Public routes
router.get("/product/:productId", getProductReviews);
router.get("/:id", getProductReview);

// Protected routes
router.use(protect);

router.post("/", validateRequest(productReviewSchema), createProductReview);
router.patch("/:id", validateRequest(productReviewUpdateSchema), updateProductReview);
router.delete("/:id", deleteProductReview);
router.get("/user", getUserProductReviews);
router.get("/user/:userId", getUserProductReviews);

// Admin only routes
router.patch("/:id/restore", restrictTo("admin"), restoreProductReview);

export default router;

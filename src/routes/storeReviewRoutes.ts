import { Router } from "express";
import {
  createStoreReview,
  getStoreReviews,
  getStoreReview,
  updateStoreReview,
  deleteStoreReview,
  getUserReviews,
  restoreStoreReview,
} from "../controllers/storeReviewController";
import { protect, restrictTo } from "../middlewares/authMiddleware";
import { validateRequest } from "../middlewares/validationMiddleware";
import {
  storeReviewSchema,
  storeReviewUpdateSchema,
} from "../validators/storeReviewValidators";

const router = Router();

// Public routes
router.get("/store/:storeId", getStoreReviews);
router.get("/:id", getStoreReview);

// Protected routes
router.use(protect);

router.post("/", validateRequest(storeReviewSchema), createStoreReview);
router.patch(
  "/:id",
  validateRequest(storeReviewUpdateSchema),
  updateStoreReview
);
router.delete("/:id", deleteStoreReview);
router.get("/user", getUserReviews);
router.get("/user/:userId", getUserReviews);

// Admin only routes
router.patch("/:id/restore", restrictTo("admin"), restoreStoreReview);

export default router;

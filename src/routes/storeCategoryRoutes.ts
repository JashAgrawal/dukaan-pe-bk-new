import { Router } from "express";
import {
  createStoreCategory,
  getStoreCategories,
  getStoreCategory,
  updateStoreCategory,
  deleteStoreCategory,
  restoreStoreCategory,
  updateStoreCounts,
} from "../controllers/storeCategoryController";
import { protect, restrictTo } from "../middlewares/authMiddleware";
import { validateRequest } from "../middlewares/validationMiddleware";
import { 
  storeCategorySchema, 
  storeCategoryUpdateSchema 
} from "../validators/storeCategoryValidators";

const router = Router();

// Public routes
router.get("/", getStoreCategories);
router.get("/:id", getStoreCategory);

// Admin only routes
router.use(protect, restrictTo("admin"));

router.post("/", validateRequest(storeCategorySchema), createStoreCategory);
router.patch("/:id", validateRequest(storeCategoryUpdateSchema), updateStoreCategory);
router.delete("/:id", deleteStoreCategory);
router.patch("/:id/restore", restoreStoreCategory);
router.patch("/update-counts", updateStoreCounts);

export default router;

import { Router } from "express";
import {
  createProductCategory,
  getProductCategories,
  getProductCategory,
  updateProductCategory,
  deleteProductCategory,
  restoreProductCategory,
  updateProductCounts,
} from "../controllers/productCategoryController";
import { protect, restrictTo } from "../middlewares/authMiddleware";
import { validateRequest } from "../middlewares/validationMiddleware";
import { 
  productCategorySchema, 
  productCategoryUpdateSchema 
} from "../validators/productCategoryValidators";

const router = Router();

// Public routes
router.get("/", getProductCategories);
router.get("/:id", getProductCategory);

// Admin only routes
router.use(protect, restrictTo("admin"));

router.post("/", validateRequest(productCategorySchema), createProductCategory);
router.patch("/:id", validateRequest(productCategoryUpdateSchema), updateProductCategory);
router.delete("/:id", deleteProductCategory);
router.patch("/:id/restore", restoreProductCategory);
router.patch("/update-counts", updateProductCounts);

export default router;

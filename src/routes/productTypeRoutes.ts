import { Router } from "express";
import {
  createProductType,
  getProductTypes,
  getProductType,
  updateProductType,
  deleteProductType,
  restoreProductType,
  getProductTypeByName,
} from "../controllers/productTypeController";
import { protect, restrictTo } from "../middlewares/authMiddleware";
import { validateRequest } from "../middlewares/validationMiddleware";
import { 
  productTypeSchema, 
  productTypeUpdateSchema 
} from "../validators/productTypeValidators";

const router = Router();

// Public routes
router.get("/", getProductTypes);
router.get("/:id", getProductType);
router.get("/name/:name", getProductTypeByName);

// Admin only routes
router.use(protect, restrictTo("admin"));

router.post("/", validateRequest(productTypeSchema), createProductType);
router.patch("/:id", validateRequest(productTypeUpdateSchema), updateProductType);
router.delete("/:id", deleteProductType);
router.patch("/:id/restore", restoreProductType);

export default router;

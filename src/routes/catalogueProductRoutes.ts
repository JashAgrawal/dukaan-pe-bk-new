import { Router } from "express";
import {
  createCatalogueProduct,
  getCatalogueProducts,
  getCatalogueProduct,
  updateCatalogueProduct,
  deleteCatalogueProduct,
  restoreCatalogueProduct,
  searchCatalogueProducts,
  getCatalogueProductsByCategory,
} from "../controllers/catalogueProductController";
import { protect, restrictTo } from "../middlewares/authMiddleware";
import { validateRequest } from "../middlewares/validationMiddleware";
import { 
  catalogueProductSchema, 
  catalogueProductUpdateSchema 
} from "../validators/catalogueProductValidators";

const router = Router();

// Public routes
router.get("/", getCatalogueProducts);
router.get("/search", searchCatalogueProducts);
router.get("/category/:categoryId", getCatalogueProductsByCategory);
router.get("/:id", getCatalogueProduct);

// Protected routes
router.use(protect);

router.post("/", validateRequest(catalogueProductSchema), createCatalogueProduct);
router.patch("/:id", validateRequest(catalogueProductUpdateSchema), updateCatalogueProduct);
router.delete("/:id", deleteCatalogueProduct);

// Admin only routes
router.patch("/:id/restore", restrictTo("admin"), restoreCatalogueProduct);

export default router;

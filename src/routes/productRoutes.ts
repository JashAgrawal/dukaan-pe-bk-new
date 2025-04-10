import { Router } from "express";
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  restoreProduct,
  getTopSellingProducts,
  getBestRatedProducts,
  getProductsByProductCategory,
  getProductsByFavouriteCount,
  searchStoreProducts,
  searchProductsOverall,
  searchProductsWithFilters,
  getStoreProducts,
} from "../controllers/productController";
import { protect, restrictTo } from "../middlewares/authMiddleware";
import { validateRequest } from "../middlewares/validationMiddleware";
import {
  productSchema,
  productUpdateSchema,
} from "../validators/productValidators";

const router = Router();

// Public routes
router.get("/", getProducts);
router.get("/top-selling", getTopSellingProducts);
router.get("/best-rated", getBestRatedProducts);
router.get("/category/:categoryId", getProductsByProductCategory);
router.get("/by-favourite", getProductsByFavouriteCount);
router.get("/search", searchStoreProducts);
router.get("/search-overall", searchProductsOverall);
router.get("/search-with-filters", searchProductsWithFilters);
router.get("/store/:storeId", getStoreProducts);
router.get("/:id", getProduct);

// Protected routes
router.use(protect);

router.post("/", validateRequest(productSchema), createProduct);
router.patch("/:id", validateRequest(productUpdateSchema), updateProduct);
router.delete("/:id", deleteProduct);

// Admin only routes
router.patch("/:id/restore", restrictTo("admin"), restoreProduct);

export default router;

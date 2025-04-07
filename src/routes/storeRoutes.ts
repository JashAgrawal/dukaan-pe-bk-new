import { Router } from "express";
import {
  createStore,
  getStores,
  getStore,
  updateStore,
  deleteStore,
  restoreStore,
  getTopSellingStores,
  getBestRatedStores,
  getNearbyStores,
  getStoresByCategory,
  getStoresByProductCategory,
  getStoresByServiceType,
  getStoresByFavouriteCount,
  searchStores,
  getMyStores,
} from "../controllers/storeController";
import { protect, restrictTo } from "../middlewares/authMiddleware";
import { validateRequest } from "../middlewares/validationMiddleware";
import { storeSchema, storeUpdateSchema } from "../validators/storeValidators";

const router = Router();

// Public routes
router.get("/", getStores);
router.get("/top-selling", getTopSellingStores);
router.get("/best-rated", getBestRatedStores);
router.get("/nearby", getNearbyStores);
router.get("/category/:categoryId", getStoresByCategory);
router.get("/product-category/:categoryId", getStoresByProductCategory);
router.get("/service-type/:type", getStoresByServiceType);
router.get("/by-favourite", getStoresByFavouriteCount);
router.get("/search", searchStores);
router.get("/:id", getStore);

// Protected routes
router.use(protect);

router.post("/", validateRequest(storeSchema), createStore);
router.get("/user/my-stores", getMyStores);
router.patch("/:id", validateRequest(storeUpdateSchema), updateStore);
router.delete("/:id", deleteStore);

// Admin only routes
router.patch("/:id/restore", restrictTo("admin"), restoreStore);

export default router;

import { Router } from "express";
import {
  createStoreImages,
  getStoreImagesCollections,
  getStoreImagesCollection,
  updateStoreImagesCollection,
  deleteStoreImagesCollection,
  restoreStoreImagesCollection,
} from "../controllers/storeImagesController";
import { protect, restrictTo } from "../middlewares/authMiddleware";
import { validateRequest } from "../middlewares/validationMiddleware";
import {
  storeImagesSchema,
  storeImagesUpdateSchema,
} from "../validators/storeImagesValidators";

const router = Router();

// Public routes
router.get("/store/:storeId", getStoreImagesCollections);
router.get("/:id", getStoreImagesCollection);

// Protected routes
router.use(protect);

router.post("/", validateRequest(storeImagesSchema), createStoreImages);
router.patch(
  "/:id",
  validateRequest(storeImagesUpdateSchema),
  updateStoreImagesCollection
);
router.delete("/:id", deleteStoreImagesCollection);

// Admin only routes
router.patch("/:id/restore", restrictTo("admin"), restoreStoreImagesCollection);

export default router;

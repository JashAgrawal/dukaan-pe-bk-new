import { Router } from "express";
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  checkWishlist,
  getPopularWishlistedStores,
} from "../controllers/storeWishlistController";
import { protect } from "../middlewares/authMiddleware";
import { validateRequest } from "../middlewares/validationMiddleware";
import { storeWishlistSchema } from "../validators/storeWishlistValidators";

const router = Router();

// Public routes
router.get("/popular", getPopularWishlistedStores);

// Protected routes
router.use(protect);

router.post("/", validateRequest(storeWishlistSchema), addToWishlist);
router.delete("/:storeId", removeFromWishlist);
router.get("/", getWishlist);
router.get("/check/:storeId", checkWishlist);

export default router;

import { Router } from "express";
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  checkWishlist,
  getPopularWishlistedProducts,
} from "../controllers/productWishlistController";
import { protect } from "../middlewares/authMiddleware";
import { validateRequest } from "../middlewares/validationMiddleware";
import { productWishlistSchema } from "../validators/productWishlistValidators";

const router = Router();

// Public routes
router.get("/popular", getPopularWishlistedProducts);

// Protected routes
router.use(protect);

router.post("/", validateRequest(productWishlistSchema), addToWishlist);
router.delete("/:productId", removeFromWishlist);
router.get("/", getWishlist);
router.get("/check/:productId", checkWishlist);

export default router;

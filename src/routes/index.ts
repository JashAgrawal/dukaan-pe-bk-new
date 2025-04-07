import { Router } from "express";
import authRoutes from "./authRoutes";
import addressRoutes from "./addressRoutes";
import storeCategoryRoutes from "./storeCategoryRoutes";
import productCategoryRoutes from "./productCategoryRoutes";
import serviceTypeRoutes from "./serviceTypeRoutes";
import storeRoutes from "./storeRoutes";
import storeReviewRoutes from "./storeReviewRoutes";
import storeWishlistRoutes from "./storeWishlistRoutes";

const router = Router();

// API routes
router.use("/auth", authRoutes);
router.use("/addresses", addressRoutes);
router.use("/store-categories", storeCategoryRoutes);
router.use("/product-categories", productCategoryRoutes);
router.use("/service-types", serviceTypeRoutes);
router.use("/stores", storeRoutes);
router.use("/store-reviews", storeReviewRoutes);
router.use("/store-wishlist", storeWishlistRoutes);

export default router;

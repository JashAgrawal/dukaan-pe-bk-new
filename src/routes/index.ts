import { Router } from "express";
import authRoutes from "./authRoutes";
import addressRoutes from "./addressRoutes";
import storeCategoryRoutes from "./storeCategoryRoutes";
import productCategoryRoutes from "./productCategoryRoutes";
import serviceTypeRoutes from "./serviceTypeRoutes";
import productTypeRoutes from "./productTypeRoutes";
import storeRoutes from "./storeRoutes";
import storeReviewRoutes from "./storeReviewRoutes";
import storeWishlistRoutes from "./storeWishlistRoutes";
import productRoutes from "./productRoutes";
import productReviewRoutes from "./productReviewRoutes";
import productWishlistRoutes from "./productWishlistRoutes";
import catalogueProductRoutes from "./catalogueProductRoutes";
import offerRoutes from "./offerRoutes";
import couponRoutes from "./couponRoutes";
import cartRoutes from "./cartRoutes";
import orderRoutes from "./orderRoutes";
import paymentRoutes from "./paymentRoutes";
import deliveryTrackingRoutes from "./deliveryTrackingRoutes";
import payoutRoutes from "./payoutRoutes";
import storePayoutRoutes from "./storePayoutRoutes";

const router = Router();

// API routes
router.use("/auth", authRoutes);
router.use("/addresses", addressRoutes);
router.use("/store-categories", storeCategoryRoutes);
router.use("/product-categories", productCategoryRoutes);
router.use("/service-types", serviceTypeRoutes);
router.use("/product-types", productTypeRoutes);
router.use("/stores", storeRoutes);
router.use("/store-reviews", storeReviewRoutes);
router.use("/store-wishlist", storeWishlistRoutes);
router.use("/products", productRoutes);
router.use("/product-reviews", productReviewRoutes);
router.use("/product-wishlist", productWishlistRoutes);
router.use("/catalogue-products", catalogueProductRoutes);
router.use("/offers", offerRoutes);
router.use("/coupons", couponRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);
router.use("/payments", paymentRoutes);
router.use("/delivery-tracking", deliveryTrackingRoutes);
router.use("/payouts", payoutRoutes);
router.use("/store-payouts", storePayoutRoutes);

export default router;

import { Router } from "express";
import {
  addItemToCart,
  removeItemFromCart,
  updateProductQuantity,
  clearCart,
  applyCoupon,
  applyOffer,
  removeCoupon,
  removeOffer,
  getCart,
  getCartItemCount,
  checkProductInCart,
} from "../controllers/cartController";
import { protect } from "../middlewares/authMiddleware";
import { validateRequest } from "../middlewares/validationMiddleware";
import {
  addToCartSchema,
  updateCartItemSchema,
  applyCouponSchema,
  applyOfferSchema,
} from "../validators/cartValidators";

const router = Router();

// All routes are protected
router.use(protect);

router.post("/add-item", validateRequest(addToCartSchema), addItemToCart);
router.delete("/remove-item/:productId", removeItemFromCart);
router.patch(
  "/update-quantity/:productId",
  validateRequest(updateCartItemSchema),
  updateProductQuantity
);
router.delete("/clear", clearCart);
router.post("/apply-coupon", validateRequest(applyCouponSchema), applyCoupon);
router.post("/apply-offer", validateRequest(applyOfferSchema), applyOffer);
router.delete("/remove-coupon", removeCoupon);
router.delete("/remove-offer", removeOffer);
router.get("/", getCart);
router.get("/count", getCartItemCount);
router.get("/check/:productId", checkProductInCart);

export default router;

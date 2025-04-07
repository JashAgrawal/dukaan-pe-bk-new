import express from "express";
import orderController from "../controllers/orderController";
import deliveryTrackingController from "../controllers/deliveryTrackingController";
import { authMiddleware } from "../middlewares/authMiddleware";
import orderValidators from "../validators/orderValidators";
import deliveryTrackingValidators from "../validators/deliveryTrackingValidators";

const router = express.Router();

// Order routes
router.post(
  "/",
  authMiddleware,
  orderValidators.validateCreateOrder,
  orderController.createOrder
);

router.get(
  "/",
  authMiddleware,
  orderController.getUserOrders
);

router.get(
  "/:id",
  authMiddleware,
  orderController.getOrderById
);

router.patch(
  "/:id/status",
  authMiddleware,
  orderValidators.validateUpdateOrderStatus,
  orderController.updateOrderStatus
);

router.post(
  "/:id/cancel",
  authMiddleware,
  orderValidators.validateCancelOrder,
  orderController.cancelOrder
);

router.post(
  "/:id/cancel-items",
  authMiddleware,
  orderValidators.validateCancelOrderItems,
  orderController.cancelOrderItems
);

// Delivery tracking routes
router.get(
  "/:orderId/tracking",
  authMiddleware,
  deliveryTrackingController.getTrackingByOrderId
);

router.post(
  "/:orderId/tracking",
  authMiddleware,
  deliveryTrackingValidators.validateAddTrackingDetails,
  deliveryTrackingController.addTrackingDetails
);

export default router;

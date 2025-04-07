import express from "express";
import payoutController from "../controllers/payoutController";
import orderController from "../controllers/orderController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

// Store payout routes
router.get(
  "/:storeId/payouts",
  authMiddleware,
  payoutController.getStorePayouts
);

router.get(
  "/:storeId/payout-summary",
  authMiddleware,
  payoutController.getPayoutSummary
);

// Store order routes
router.get(
  "/:storeId/orders",
  authMiddleware,
  orderController.getStoreOrders
);

export default router;

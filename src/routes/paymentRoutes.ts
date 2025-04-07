import express from "express";
import paymentController from "../controllers/paymentController";
import { authMiddleware } from "../middlewares/authMiddleware";
import paymentValidators from "../validators/paymentValidators";

const router = express.Router();

// Payment routes
router.post(
  "/create-razorpay-order",
  authMiddleware,
  paymentValidators.validateCreateRazorpayOrder,
  paymentController.createRazorpayOrder
);

router.post(
  "/verify",
  authMiddleware,
  paymentValidators.validateVerifyPayment,
  paymentController.verifyPayment
);

router.post(
  "/:id/refund",
  authMiddleware,
  paymentValidators.validateProcessRefund,
  paymentController.processRefund
);

// Webhook route (no auth required as it's called by Razorpay)
router.post("/webhook", paymentController.webhookHandler);

export default router;

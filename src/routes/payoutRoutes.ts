import express from "express";
import payoutController from "../controllers/payoutController";
import { authMiddleware } from "../middlewares/authMiddleware";
import payoutValidators from "../validators/payoutValidators";

const router = express.Router();

// Payout routes
router.post(
  "/generate",
  authMiddleware,
  payoutValidators.validateGeneratePayout,
  payoutController.generatePayout
);

router.post(
  "/:id/process",
  authMiddleware,
  payoutValidators.validateProcessPayout,
  payoutController.processPayout
);

router.get(
  "/:id",
  authMiddleware,
  payoutController.getPayoutById
);

export default router;

import express from "express";
import deliveryTrackingController from "../controllers/deliveryTrackingController";
import { authMiddleware } from "../middlewares/authMiddleware";
import deliveryTrackingValidators from "../validators/deliveryTrackingValidators";

const router = express.Router();

// Delivery tracking routes
router.patch(
  "/:id",
  authMiddleware,
  deliveryTrackingValidators.validateUpdateTrackingStatus,
  deliveryTrackingController.updateTrackingStatus
);

export default router;

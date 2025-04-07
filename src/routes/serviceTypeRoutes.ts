import { Router } from "express";
import {
  createServiceType,
  getServiceTypes,
  getServiceType,
  updateServiceType,
  deleteServiceType,
  restoreServiceType,
  getServiceTypeByName,
} from "../controllers/serviceTypeController";
import { protect, restrictTo } from "../middlewares/authMiddleware";
import { validateRequest } from "../middlewares/validationMiddleware";
import { 
  serviceTypeSchema, 
  serviceTypeUpdateSchema 
} from "../validators/serviceTypeValidators";

const router = Router();

// Public routes
router.get("/", getServiceTypes);
router.get("/:id", getServiceType);
router.get("/name/:name", getServiceTypeByName);

// Admin only routes
router.use(protect, restrictTo("admin"));

router.post("/", validateRequest(serviceTypeSchema), createServiceType);
router.patch("/:id", validateRequest(serviceTypeUpdateSchema), updateServiceType);
router.delete("/:id", deleteServiceType);
router.patch("/:id/restore", restoreServiceType);

export default router;

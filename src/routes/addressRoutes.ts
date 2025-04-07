import { Router } from "express";
import {
  addAddress,
  getAddresses,
  getAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  restoreAddress,
  getAllAddressesWithDeleted,
} from "../controllers/addressController";
import { protect, restrictTo } from "../middlewares/authMiddleware";
import { validateRequest } from "../middlewares/validationMiddleware";
import { addressSchema } from "@/validators/addressValidators";

const router = Router();

// All routes are protected
router.use(protect);

// Admin only routes
router.get("/all", protect, restrictTo("admin"), getAllAddressesWithDeleted);

router
  .route("/")
  .get(getAddresses)
  .post(validateRequest(addressSchema), addAddress);

router
  .route("/:id")
  .get(getAddress)
  .patch(validateRequest(addressSchema), updateAddress)
  .delete(deleteAddress);

router.patch("/:id/set-default", setDefaultAddress);
router.patch("/:id/restore", restoreAddress);

export default router;

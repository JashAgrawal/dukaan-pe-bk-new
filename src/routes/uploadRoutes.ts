import { Router } from "express";
import {
  uploadImage,
  uploadImages,
  deleteImage,
  uploadSingleImage,
  uploadMultipleImages,
} from "../controllers/uploadController";
import { protect } from "../middlewares/authMiddleware";

const router = Router();

// All routes are protected
router.use(protect);

// Upload routes
router.post("/image", uploadSingleImage, uploadImage);
router.post("/images", uploadMultipleImages, uploadImages);
router.delete("/image", deleteImage);

export default router;

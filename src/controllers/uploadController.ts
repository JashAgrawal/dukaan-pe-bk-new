import { Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { AppError, catchAsync } from "../middlewares/errorHandler";

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), "public/static/images/uploads");
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileType = req.body.type || "general";
    const ext = path.extname(file.originalname);
    cb(null, `${fileType}_${uniqueSuffix}${ext}`);
  },
});

// File filter
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Accept only image files
  const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, JPEG, PNG, and WEBP files are allowed"));
  }
};

// Configure multer upload
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// Middleware to handle single image upload
export const uploadSingleImage = upload.single("image");

// Middleware to handle multiple image upload
export const uploadMultipleImages = upload.array("images", 10); // Max 10 images

/**
 * Upload a single image
 * @route POST /api/upload/image
 * @access Private
 */
export const uploadImage = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return next(new AppError("Please upload an image", 400));
  }

  // Get the file path
  const relativePath = `/static/images/uploads/${req.file.filename}`;
  const imageUrl = `${req.protocol}://${req.get("host")}${relativePath}`;

  res.status(200).json({
    status: "success",
    data: {
      imageUrl,
      relativePath,
    },
  });
});

/**
 * Upload multiple images
 * @route POST /api/upload/images
 * @access Private
 */
export const uploadImages = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
    return next(new AppError("Please upload at least one image", 400));
  }

  const files = req.files as Express.Multer.File[];
  const imageUrls: string[] = [];
  const relativePaths: string[] = [];

  // Process each file
  files.forEach((file) => {
    const relativePath = `/static/images/uploads/${file.filename}`;
    const imageUrl = `${req.protocol}://${req.get("host")}${relativePath}`;
    
    imageUrls.push(imageUrl);
    relativePaths.push(relativePath);
  });

  res.status(200).json({
    status: "success",
    data: {
      imageUrls,
      relativePaths,
    },
  });
});

/**
 * Delete an image
 * @route DELETE /api/upload/image
 * @access Private
 */
export const deleteImage = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { imagePath } = req.body;

  if (!imagePath) {
    return next(new AppError("Please provide an image path", 400));
  }

  // Ensure the path is within the uploads directory
  if (!imagePath.startsWith("/static/images/uploads/")) {
    return next(new AppError("Invalid image path", 400));
  }

  const fullPath = path.join(process.cwd(), "public", imagePath);

  // Check if file exists
  if (!fs.existsSync(fullPath)) {
    return next(new AppError("Image not found", 404));
  }

  // Delete the file
  fs.unlinkSync(fullPath);

  res.status(200).json({
    status: "success",
    message: "Image deleted successfully",
  });
});

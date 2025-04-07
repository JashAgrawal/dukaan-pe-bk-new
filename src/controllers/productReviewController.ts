import { Request, Response, NextFunction } from "express";
import { ProductReview } from "../models/ProductReview";
import { Product } from "../models/Product";
import { AppError, catchAsync } from "../middlewares/errorHandler";

/**
 * Create a new product review
 * @route POST /api/product-reviews
 * @access Private
 */
export const createProductReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;

    // Check if product exists
    const product = await Product.findById(req.body.product);
    if (!product) {
      return next(new AppError("Product not found", 404));
    }

    // Check if user has already reviewed this product
    const existingReview = await ProductReview.findOne({
      product: req.body.product,
      user: userId,
      isDeleted: false,
    });

    if (existingReview) {
      return next(
        new AppError("You have already reviewed this product", 400)
      );
    }

    // Create review
    const review = await ProductReview.create({
      ...req.body,
      user: userId,
    });

    res.status(201).json({
      status: "success",
      data: { review },
    });
  }
);

/**
 * Get all reviews for a product
 * @route GET /api/products/:productId/reviews
 * @access Public
 */
export const getProductReviews = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const productId = req.params.productId;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return next(new AppError("Product not found", 404));
    }

    const reviews = await ProductReview.find({ product: productId })
      .populate({
        path: "user",
        select: "name",
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      results: reviews.length,
      data: { reviews },
    });
  }
);

/**
 * Get a single review
 * @route GET /api/product-reviews/:id
 * @access Public
 */
export const getProductReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const review = await ProductReview.findById(req.params.id).populate({
      path: "user",
      select: "name",
    });

    if (!review) {
      return next(new AppError("Review not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: { review },
    });
  }
);

/**
 * Update a review
 * @route PATCH /api/product-reviews/:id
 * @access Private
 */
export const updateProductReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;

    // Find review
    const review = await ProductReview.findById(req.params.id);

    if (!review) {
      return next(new AppError("Review not found", 404));
    }

    // Check if user is the owner of the review
    if (review.user.toString() !== userId) {
      return next(
        new AppError("You can only update your own reviews", 403)
      );
    }

    // Update review
    Object.assign(review, req.body);
    await review.save();

    res.status(200).json({
      status: "success",
      data: { review },
    });
  }
);

/**
 * Delete a review (soft delete)
 * @route DELETE /api/product-reviews/:id
 * @access Private
 */
export const deleteProductReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    const isAdmin = (req as any).user.role === "admin";

    // Find review
    const review = await ProductReview.findById(req.params.id);

    if (!review) {
      return next(new AppError("Review not found", 404));
    }

    // Check if user is the owner of the review or an admin
    if (review.user.toString() !== userId && !isAdmin) {
      return next(
        new AppError("You can only delete your own reviews", 403)
      );
    }

    // Soft delete
    review.isDeleted = true;
    review.deletedAt = new Date();
    await review.save();

    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);

/**
 * Get all reviews by a user
 * @route GET /api/users/reviews
 * @route GET /api/users/:userId/reviews
 * @access Private
 */
export const getUserProductReviews = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId || (req as any).user.id;
    const isOwnProfile = userId === (req as any).user.id;
    const isAdmin = (req as any).user.role === "admin";

    // Only allow users to see their own reviews or admins to see any user's reviews
    if (!isOwnProfile && !isAdmin) {
      return next(
        new AppError("You can only view your own reviews", 403)
      );
    }

    const reviews = await ProductReview.find({ user: userId })
      .populate({
        path: "product",
        select: "name mainImage",
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      results: reviews.length,
      data: { reviews },
    });
  }
);

/**
 * Restore a deleted review
 * @route PATCH /api/product-reviews/:id/restore
 * @access Private/Admin
 */
export const restoreProductReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const isAdmin = (req as any).user.role === "admin";

    if (!isAdmin) {
      return next(
        new AppError("Only admins can restore deleted reviews", 403)
      );
    }

    const review = await ProductReview.findOne(
      { _id: req.params.id, isDeleted: true },
      null,
      { includeSoftDeleted: true }
    );

    if (!review) {
      return next(new AppError("Deleted review not found", 404));
    }

    // Restore
    review.isDeleted = false;
    review.deletedAt = undefined;
    await review.save();

    res.status(200).json({
      status: "success",
      data: { review },
    });
  }
);

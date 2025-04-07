import { Request, Response, NextFunction } from "express";
import { StoreReview } from "../models/StoreReview";
import { Store } from "../models/Store";
import { AppError, catchAsync } from "../middlewares/errorHandler";

/**
 * Create a new store review
 * @route POST /api/store-reviews
 * @access Private
 */
export const createStoreReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;

    // Check if store exists
    const store = await Store.findById(req.body.store);
    if (!store) {
      return next(new AppError("Store not found", 404));
    }

    // Check if user has already reviewed this store
    const existingReview = await StoreReview.findOne({
      store: req.body.store,
      user: userId,
      isDeleted: false,
    });

    if (existingReview) {
      return next(new AppError("You have already reviewed this store", 400));
    }

    // Create review
    const review = await StoreReview.create({
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
 * Get all reviews for a store
 * @route GET /api/stores/:storeId/reviews
 * @access Public
 */
export const getStoreReviews = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const storeId = req.params.storeId;

    // Check if store exists
    const store = await Store.findById(storeId);
    if (!store) {
      return next(new AppError("Store not found", 404));
    }

    const reviews = await StoreReview.find({ store: storeId })
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
 * @route GET /api/store-reviews/:id
 * @access Public
 */
export const getStoreReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const review = await StoreReview.findById(req.params.id).populate({
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
 * @route PATCH /api/store-reviews/:id
 * @access Private
 */
export const updateStoreReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;

    // Find review
    const review = await StoreReview.findById(req.params.id);

    if (!review) {
      return next(new AppError("Review not found", 404));
    }

    // Check if user is the owner of the review
    if (review.user.toString() !== userId) {
      return next(new AppError("You can only update your own reviews", 403));
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
 * @route DELETE /api/store-reviews/:id
 * @access Private
 */
export const deleteStoreReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    const isAdmin = (req as any).user.role === "admin";

    // Find review
    const review = await StoreReview.findById(req.params.id);

    if (!review) {
      return next(new AppError("Review not found", 404));
    }

    // Check if user is the owner of the review or an admin
    if (review.user.toString() !== userId && !isAdmin) {
      return next(new AppError("You can only delete your own reviews", 403));
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
 * @route GET /api/store-reviews/user
 * @route GET /api/store-reviews/user/:userId
 * @access Private
 */
export const getUserReviews = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // If userId is provided in params, use it, otherwise use the current user's id
    const userId = req.params.userId || (req as any).user.id;
    const isOwnProfile = userId === (req as any).user.id;
    const isAdmin = (req as any).user.role === "admin";

    // Only allow users to see their own reviews or admins to see any user's reviews
    if (!isOwnProfile && !isAdmin) {
      return next(new AppError("You can only view your own reviews", 403));
    }

    const reviews = await StoreReview.find({ user: userId })
      .populate({
        path: "store",
        select: "name logo",
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
 * @route PATCH /api/store-reviews/:id/restore
 * @access Private/Admin
 */
export const restoreStoreReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const isAdmin = (req as any).user.role === "admin";

    if (!isAdmin) {
      return next(new AppError("Only admins can restore deleted reviews", 403));
    }

    const review = await StoreReview.findOne(
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

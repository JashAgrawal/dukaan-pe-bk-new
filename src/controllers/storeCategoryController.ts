import { Request, Response, NextFunction } from "express";
import { StoreCategory } from "../models/StoreCategory";
import { AppError, catchAsync } from "../middlewares/errorHandler";
import { Store } from "../models/Store";

/**
 * Create a new store category
 * @route POST /api/store-categories
 * @access Private/Admin
 */
export const createStoreCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const category = await StoreCategory.create(req.body);

    res.status(201).json({
      status: "success",
      data: { category },
    });
  }
);

/**
 * Get all store categories
 * @route GET /api/store-categories
 * @access Public
 */
export const getStoreCategories = catchAsync(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20; // Higher default limit for categories
    const skip = (page - 1) * limit;

    // Only return parent categories (where parentId is null or undefined)
    const categories = await StoreCategory.find({ parentId: null })
      .sort({ popularityIndex: -1 })
      .skip(skip)
      .limit(limit);

    const total = await StoreCategory.countDocuments({ parentId: null });

    res.status(200).json({
      status: "success",
      results: categories.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
      data: { categories },
    });
  }
);

/**
 * Get a single store category
 * @route GET /api/store-categories/:id
 * @access Public
 */
export const getStoreCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const category = await StoreCategory.findById(req.params.id);

    if (!category) {
      return next(new AppError("Category not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: { category },
    });
  }
);

/**
 * Update a store category
 * @route PATCH /api/store-categories/:id
 * @access Private/Admin
 */
export const updateStoreCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const category = await StoreCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!category) {
      return next(new AppError("Category not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: { category },
    });
  }
);

/**
 * Delete a store category (soft delete)
 * @route DELETE /api/store-categories/:id
 * @access Private/Admin
 */
export const deleteStoreCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const category = await StoreCategory.findById(req.params.id);

    if (!category) {
      return next(new AppError("Category not found", 404));
    }

    // Check if there are any stores using this category
    const storeCount = await Store.countDocuments({
      category: req.params.id,
      isDeleted: false,
    });

    if (storeCount > 0) {
      return next(
        new AppError(
          `Cannot delete category because it is used by ${storeCount} stores`,
          400
        )
      );
    }

    // Soft delete
    category.isDeleted = true;
    category.deletedAt = new Date();
    await category.save();

    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);

/**
 * Restore a deleted store category
 * @route PATCH /api/store-categories/:id/restore
 * @access Private/Admin
 */
export const restoreStoreCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const category = await StoreCategory.findOne(
      { _id: req.params.id, isDeleted: true },
      null,
      { includeSoftDeleted: true }
    );

    if (!category) {
      return next(new AppError("Deleted category not found", 404));
    }

    // Restore
    category.isDeleted = false;
    category.deletedAt = undefined;
    await category.save();

    res.status(200).json({
      status: "success",
      data: { category },
    });
  }
);

/**
 * Update store counts for all categories
 * @route PATCH /api/store-categories/update-counts
 * @access Private/Admin
 */
export const updateStoreCounts = catchAsync(
  async (req: Request, res: Response) => {
    const categories = await StoreCategory.find();

    for (const category of categories) {
      const count = await Store.countDocuments({
        category: category._id,
        isDeleted: false,
      });

      category.noOfStores = count;
      await category.save();
    }

    res.status(200).json({
      status: "success",
      message: "Store counts updated for all categories",
    });
  }
);

/**
 * Get subcategories for a parent category
 * @route GET /api/store-categories/sub
 * @access Public
 */
export const getSubStoreCategories = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const parentCategoryId = req.query.parentCategoryId as string;

    if (!parentCategoryId) {
      return next(new AppError("Parent category ID is required", 400));
    }

    // Validate if parent category exists
    const parentCategory = await StoreCategory.findById(parentCategoryId);
    if (!parentCategory) {
      return next(new AppError("Parent category not found", 404));
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const subcategories = await StoreCategory.find({
      parentId: parentCategoryId,
    })
      .sort({ popularityIndex: -1 })
      .skip(skip)
      .limit(limit);

    const total = await StoreCategory.countDocuments({
      parentId: parentCategoryId,
    });

    res.status(200).json({
      status: "success",
      results: subcategories.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
      data: { subcategories },
    });
  }
);

import { Request, Response, NextFunction } from "express";
import { ProductCategory } from "../models/ProductCategory";
import { AppError, catchAsync } from "../middlewares/errorHandler";
import { Store } from "../models/Store";

/**
 * Create a new product category
 * @route POST /api/product-categories
 * @access Private/Admin
 */
export const createProductCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const category = await ProductCategory.create(req.body);

    res.status(201).json({
      status: "success",
      data: { category },
    });
  }
);

/**
 * Get all product categories
 * @route GET /api/product-categories
 * @access Public
 */
export const getProductCategories = catchAsync(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20; // Higher default limit for categories
    const skip = (page - 1) * limit;

    // Only return parent categories (where parentId is null or undefined)
    const categories = await ProductCategory.find({ parentId: null })
      .sort({ popularityIndex: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ProductCategory.countDocuments({ parentId: null });

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
 * Get a single product category
 * @route GET /api/product-categories/:id
 * @access Public
 */
export const getProductCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const category = await ProductCategory.findById(req.params.id);

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
 * Update a product category
 * @route PATCH /api/product-categories/:id
 * @access Private/Admin
 */
export const updateProductCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const category = await ProductCategory.findByIdAndUpdate(
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
 * Delete a product category (soft delete)
 * @route DELETE /api/product-categories/:id
 * @access Private/Admin
 */
export const deleteProductCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const category = await ProductCategory.findById(req.params.id);

    if (!category) {
      return next(new AppError("Category not found", 404));
    }

    // Check if there are any stores using this product category
    const storeCount = await Store.countDocuments({
      productCategories: req.params.id,
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
 * Restore a deleted product category
 * @route PATCH /api/product-categories/:id/restore
 * @access Private/Admin
 */
export const restoreProductCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const category = await ProductCategory.findOne(
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
 * Update product counts for all categories
 * @route PATCH /api/product-categories/update-counts
 * @access Private/Admin
 */
export const updateProductCounts = catchAsync(
  async (req: Request, res: Response) => {
    // This is a placeholder. In a real application, you would count products
    // from a Product model that references these categories.
    // For now, we'll just update based on stores that use these categories.

    const categories = await ProductCategory.find();

    for (const category of categories) {
      const storeCount = await Store.countDocuments({
        productCategories: category._id,
        isDeleted: false,
      });

      // This is just an approximation. In a real app, you'd count actual products
      category.noOfProducts = storeCount * 10; // Assuming each store has about 10 products
      await category.save();
    }

    res.status(200).json({
      status: "success",
      message: "Product counts updated for all categories",
    });
  }
);

/**
 * Get subcategories for a parent category
 * @route GET /api/product-categories/sub
 * @access Public
 */
export const getSubProductCategories = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const parentCategoryId = req.query.parentCategoryId as string;

    if (!parentCategoryId) {
      return next(new AppError("Parent category ID is required", 400));
    }

    // Validate if parent category exists
    const parentCategory = await ProductCategory.findById(parentCategoryId);
    if (!parentCategory) {
      return next(new AppError("Parent category not found", 404));
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const subcategories = await ProductCategory.find({
      parentId: parentCategoryId,
    })
      .sort({ popularityIndex: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ProductCategory.countDocuments({
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

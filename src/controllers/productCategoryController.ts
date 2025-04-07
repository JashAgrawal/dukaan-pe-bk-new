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
    const categories = await ProductCategory.find().sort({ popularityIndex: -1 });

    res.status(200).json({
      status: "success",
      results: categories.length,
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
      isDeleted: false
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

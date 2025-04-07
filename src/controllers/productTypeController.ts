import { Request, Response, NextFunction } from "express";
import { ProductType } from "../models/ProductType";
import { AppError, catchAsync } from "../middlewares/errorHandler";
import { Product } from "../models/Product";

/**
 * Create a new product type
 * @route POST /api/product-types
 * @access Private/Admin
 */
export const createProductType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const productType = await ProductType.create(req.body);

    res.status(201).json({
      status: "success",
      data: { productType },
    });
  }
);

/**
 * Get all product types
 * @route GET /api/product-types
 * @access Public
 */
export const getProductTypes = catchAsync(async (req: Request, res: Response) => {
  const productTypes = await ProductType.find();

  res.status(200).json({
    status: "success",
    results: productTypes.length,
    data: { productTypes },
  });
});

/**
 * Get a single product type
 * @route GET /api/product-types/:id
 * @access Public
 */
export const getProductType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const productType = await ProductType.findById(req.params.id);

    if (!productType) {
      return next(new AppError("Product type not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: { productType },
    });
  }
);

/**
 * Update a product type
 * @route PATCH /api/product-types/:id
 * @access Private/Admin
 */
export const updateProductType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Don't allow changing the name of a product type
    if (req.body.name) {
      delete req.body.name;
    }

    const productType = await ProductType.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!productType) {
      return next(new AppError("Product type not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: { productType },
    });
  }
);

/**
 * Delete a product type (soft delete)
 * @route DELETE /api/product-types/:id
 * @access Private/Admin
 */
export const deleteProductType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const productType = await ProductType.findById(req.params.id);

    if (!productType) {
      return next(new AppError("Product type not found", 404));
    }

    // Check if there are any products using this product type
    const productCount = await Product.countDocuments({ 
      type: productType.name,
      isDeleted: false
    });

    if (productCount > 0) {
      return next(
        new AppError(
          `Cannot delete product type because it is used by ${productCount} products`,
          400
        )
      );
    }

    // Soft delete
    productType.isDeleted = true;
    productType.deletedAt = new Date();
    await productType.save();

    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);

/**
 * Restore a deleted product type
 * @route PATCH /api/product-types/:id/restore
 * @access Private/Admin
 */
export const restoreProductType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const productType = await ProductType.findOne(
      { _id: req.params.id, isDeleted: true },
      null,
      { includeSoftDeleted: true }
    );

    if (!productType) {
      return next(new AppError("Deleted product type not found", 404));
    }

    // Restore
    productType.isDeleted = false;
    productType.deletedAt = undefined;
    await productType.save();

    res.status(200).json({
      status: "success",
      data: { productType },
    });
  }
);

/**
 * Get product type by name
 * @route GET /api/product-types/name/:name
 * @access Public
 */
export const getProductTypeByName = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const productType = await ProductType.findOne({ name: req.params.name });

    if (!productType) {
      return next(new AppError("Product type not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: { productType },
    });
  }
);

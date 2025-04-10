import { Request, Response, NextFunction } from "express";
import { CatalogueProduct } from "../models/CatalogueProduct";
import { Product } from "../models/Product";
import { ProductCategory } from "../models/ProductCategory";
import { Store } from "../models/Store";
import { AppError, catchAsync } from "../middlewares/errorHandler";
import mongoose from "mongoose";

// Helper function to build the base query
const buildBaseQuery = (req: Request) => {
  // Initialize empty query object
  let query: any = {};

  return query;
};

/**
 * Create a new catalogue product
 * @route POST /api/catalogue-products
 * @access Private
 */
export const createCatalogueProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Remove any store-related fields from the request
    if (req.body.store_id) delete req.body.store_id;
    if (req.body.store) delete req.body.store;

    // Create catalogue product
    const catalogueProduct = await CatalogueProduct.create(req.body);

    // Update product category count
    await ProductCategory.findByIdAndUpdate(catalogueProduct.category, {
      $inc: { noOfProducts: 1 },
    });

    res.status(201).json({
      status: "success",
      data: { catalogueProduct },
    });
  }
);

/**
 * Get all catalogue products
 * @route GET /api/catalogue-products
 * @access Public
 */
export const getCatalogueProducts = catchAsync(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const query = buildBaseQuery(req);

    const catalogueProducts = await CatalogueProduct.find(query)
      .sort({ popularityIndex: -1, orderCount: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "category",
        select: "name",
      });

    const total = await CatalogueProduct.countDocuments(query);

    res.status(200).json({
      status: "success",
      results: catalogueProducts.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
      data: { catalogueProducts },
    });
  }
);

/**
 * Get a single catalogue product
 * @route GET /api/catalogue-products/:id
 * @access Public
 */
export const getCatalogueProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const catalogueProduct = await CatalogueProduct.findById(
      req.params.id
    ).populate({
      path: "category",
      select: "name",
    });

    if (!catalogueProduct) {
      return next(new AppError("Catalogue product not found", 404));
    }

    // Get all products related to this catalogue product
    const relatedProducts = await Product.find({
      relatedCatalogueProductId: catalogueProduct._id,
      isDeleted: false,
    })
      .select("name mainImage price sellingPrice store_id")
      .populate({
        path: "store",
        select: "name logo",
      });

    res.status(200).json({
      status: "success",
      data: {
        catalogueProduct,
        relatedProducts,
      },
    });
  }
);

/**
 * Update a catalogue product
 * @route PATCH /api/catalogue-products/:id
 * @access Private
 */
export const updateCatalogueProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const isAdmin = (req as any).user.role === "admin";

    // Find catalogue product
    const catalogueProduct = await CatalogueProduct.findById(req.params.id);

    if (!catalogueProduct) {
      return next(new AppError("Catalogue product not found", 404));
    }

    // Remove any store-related fields from the request
    if (req.body.store_id) delete req.body.store_id;
    if (req.body.store) delete req.body.store;

    // Check if category is being changed
    const oldCategoryId = catalogueProduct.category;
    const newCategoryId = req.body.category;

    // Update catalogue product
    const updatedCatalogueProduct = await CatalogueProduct.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate({
      path: "category",
      select: "name",
    });

    // Update category counts if category changed
    if (newCategoryId && oldCategoryId.toString() !== newCategoryId) {
      await ProductCategory.findByIdAndUpdate(oldCategoryId, {
        $inc: { noOfProducts: -1 },
      });

      await ProductCategory.findByIdAndUpdate(newCategoryId, {
        $inc: { noOfProducts: 1 },
      });
    }

    res.status(200).json({
      status: "success",
      data: { catalogueProduct: updatedCatalogueProduct },
    });
  }
);

/**
 * Delete a catalogue product (soft delete)
 * @route DELETE /api/catalogue-products/:id
 * @access Private
 */
export const deleteCatalogueProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const isAdmin = (req as any).user.role === "admin";

    // Find catalogue product
    const catalogueProduct = await CatalogueProduct.findById(req.params.id);

    if (!catalogueProduct) {
      return next(new AppError("Catalogue product not found", 404));
    }

    // Only admins can delete catalogue products now that they're not store-specific
    if (!isAdmin) {
      return next(
        new AppError("Only administrators can delete catalogue products", 403)
      );
    }

    // Check if there are any products using this catalogue product
    const productCount = await Product.countDocuments({
      relatedCatalogueProductId: catalogueProduct._id,
      isDeleted: false,
    });

    if (productCount > 0) {
      return next(
        new AppError(
          `Cannot delete catalogue product because it is used by ${productCount} products`,
          400
        )
      );
    }

    // Soft delete
    catalogueProduct.isDeleted = true;
    catalogueProduct.deletedAt = new Date();
    await catalogueProduct.save();

    // Update category count
    await ProductCategory.findByIdAndUpdate(catalogueProduct.category, {
      $inc: { noOfProducts: -1 },
    });

    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);

/**
 * Restore a deleted catalogue product
 * @route PATCH /api/catalogue-products/:id/restore
 * @access Private/Admin
 */
export const restoreCatalogueProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const isAdmin = (req as any).user.role === "admin";

    if (!isAdmin) {
      return next(
        new AppError("Only admins can restore deleted catalogue products", 403)
      );
    }

    const catalogueProduct = await CatalogueProduct.findOne(
      { _id: req.params.id, isDeleted: true },
      null,
      { includeSoftDeleted: true }
    );

    if (!catalogueProduct) {
      return next(new AppError("Deleted catalogue product not found", 404));
    }

    // Restore
    catalogueProduct.isDeleted = false;
    catalogueProduct.deletedAt = undefined;
    await catalogueProduct.save();

    // Update category count
    await ProductCategory.findByIdAndUpdate(catalogueProduct.category, {
      $inc: { noOfProducts: 1 },
    });

    res.status(200).json({
      status: "success",
      data: { catalogueProduct },
    });
  }
);

/**
 * Search catalogue products
 * @route GET /api/catalogue-products/search
 * @access Public
 */
export const searchCatalogueProducts = catchAsync(
  async (req: Request, res: Response) => {
    const searchTerm = req.query.q as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    if (!searchTerm) {
      return res.status(200).json({
        status: "success",
        results: 0,
        data: { catalogueProducts: [] },
      });
    }

    // Build base query
    const baseQuery = buildBaseQuery(req);

    // Try text search first
    let catalogueProducts = [];
    let total = 0;

    try {
      // First attempt: Use text search with proper index
      const textQuery = {
        ...baseQuery,
        $text: { $search: searchTerm },
        isDeleted: false,
      };

      catalogueProducts = await CatalogueProduct.find(textQuery)
        .sort({ score: { $meta: "textScore" }, popularityIndex: -1 })
        .skip(skip)
        .limit(limit)
        .populate({
          path: "category",
          select: "name",
        });

      total = await CatalogueProduct.countDocuments(textQuery);
    } catch (error) {
      // If text search fails, fallback to regex search
      const regexQuery = {
        ...baseQuery,
        isDeleted: false,
        $or: [
          { name: { $regex: searchTerm, $options: "i" } },
          { description: { $regex: searchTerm, $options: "i" } },
          { tags: { $regex: searchTerm, $options: "i" } },
        ],
      };

      catalogueProducts = await CatalogueProduct.find(regexQuery)
        .sort({ popularityIndex: -1 })
        .skip(skip)
        .limit(limit)
        .populate({
          path: "category",
          select: "name",
        });

      total = await CatalogueProduct.countDocuments(regexQuery);
    }

    res.status(200).json({
      status: "success",
      results: catalogueProducts.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
      data: { catalogueProducts },
    });
  }
);

/**
 * Get catalogue products by category
 * @route GET /api/catalogue-products/category/:categoryId
 * @access Public
 */
export const getCatalogueProductsByCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const categoryId = req.params.categoryId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Check if category exists
    const category = await ProductCategory.findById(categoryId);
    if (!category) {
      return next(new AppError("Category not found", 404));
    }

    const query = {
      ...buildBaseQuery(req),
      category: categoryId,
    };

    const catalogueProducts = await CatalogueProduct.find(query)
      .sort({ popularityIndex: -1, orderCount: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "category",
        select: "name",
      });

    const total = await CatalogueProduct.countDocuments(query);

    res.status(200).json({
      status: "success",
      results: catalogueProducts.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
      data: { catalogueProducts },
    });
  }
);

import { Request, Response, NextFunction } from "express";
import { CatalogueProduct } from "../models/CatalogueProduct";
import { Product } from "../models/Product";
import { ProductCategory } from "../models/ProductCategory";
import { Store } from "../models/Store";
import { AppError, catchAsync } from "../middlewares/errorHandler";
import mongoose from "mongoose";

// Helper function to build the base query with store_id filtering
const buildBaseQuery = (req: Request) => {
  const storeId = req.query.store_id as string;
  
  let query: any = {};
  
  // Filter by store if provided
  if (storeId) {
    query.store_id = storeId;
  }
  
  return query;
};

/**
 * Create a new catalogue product
 * @route POST /api/catalogue-products
 * @access Private
 */
export const createCatalogueProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    
    // Check if store exists and user is the owner
    const store = await Store.findById(req.body.store_id);
    if (!store) {
      return next(new AppError("Store not found", 404));
    }
    
    if (store.owner_id.toString() !== userId && (req as any).user.role !== "admin") {
      return next(
        new AppError("You can only add catalogue products to your own store", 403)
      );
    }
    
    // Set store reference to match store_id
    req.body.store = req.body.store_id;
    
    // Create catalogue product
    const catalogueProduct = await CatalogueProduct.create(req.body);
    
    // Update product category count
    await ProductCategory.findByIdAndUpdate(
      catalogueProduct.category,
      { $inc: { noOfProducts: 1 } }
    );
    
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
export const getCatalogueProducts = catchAsync(async (req: Request, res: Response) => {
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
    })
    .populate({
      path: "store",
      select: "name logo",
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
});

/**
 * Get a single catalogue product
 * @route GET /api/catalogue-products/:id
 * @access Public
 */
export const getCatalogueProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const catalogueProduct = await CatalogueProduct.findById(req.params.id)
      .populate({
        path: "category",
        select: "name",
      })
      .populate({
        path: "store",
        select: "name logo",
      });
    
    if (!catalogueProduct) {
      return next(new AppError("Catalogue product not found", 404));
    }
    
    // Get all products related to this catalogue product
    const relatedProducts = await Product.find({ 
      relatedCatalogueProductId: catalogueProduct._id,
      isDeleted: false
    })
    .select('name mainImage price sellingPrice store_id')
    .populate({
      path: "store",
      select: "name logo",
    });
    
    res.status(200).json({
      status: "success",
      data: { 
        catalogueProduct,
        relatedProducts
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
    const userId = (req as any).user.id;
    const isAdmin = (req as any).user.role === "admin";
    
    // Find catalogue product
    const catalogueProduct = await CatalogueProduct.findById(req.params.id);
    
    if (!catalogueProduct) {
      return next(new AppError("Catalogue product not found", 404));
    }
    
    // Check if user is the store owner or an admin
    const store = await Store.findById(catalogueProduct.store_id);
    if (!store) {
      return next(new AppError("Store not found", 404));
    }
    
    if (store.owner_id.toString() !== userId && !isAdmin) {
      return next(
        new AppError("You can only update catalogue products in your own store", 403)
      );
    }
    
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
    )
      .populate({
        path: "category",
        select: "name",
      })
      .populate({
        path: "store",
        select: "name logo",
      });
    
    // Update category counts if category changed
    if (newCategoryId && oldCategoryId.toString() !== newCategoryId) {
      await ProductCategory.findByIdAndUpdate(
        oldCategoryId,
        { $inc: { noOfProducts: -1 } }
      );
      
      await ProductCategory.findByIdAndUpdate(
        newCategoryId,
        { $inc: { noOfProducts: 1 } }
      );
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
    const userId = (req as any).user.id;
    const isAdmin = (req as any).user.role === "admin";
    
    // Find catalogue product
    const catalogueProduct = await CatalogueProduct.findById(req.params.id);
    
    if (!catalogueProduct) {
      return next(new AppError("Catalogue product not found", 404));
    }
    
    // Check if user is the store owner or an admin
    const store = await Store.findById(catalogueProduct.store_id);
    if (!store) {
      return next(new AppError("Store not found", 404));
    }
    
    if (store.owner_id.toString() !== userId && !isAdmin) {
      return next(
        new AppError("You can only delete catalogue products in your own store", 403)
      );
    }
    
    // Check if there are any products using this catalogue product
    const productCount = await Product.countDocuments({ 
      relatedCatalogueProductId: catalogueProduct._id,
      isDeleted: false
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
    await ProductCategory.findByIdAndUpdate(
      catalogueProduct.category,
      { $inc: { noOfProducts: -1 } }
    );
    
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
    await ProductCategory.findByIdAndUpdate(
      catalogueProduct.category,
      { $inc: { noOfProducts: 1 } }
    );
    
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
export const searchCatalogueProducts = catchAsync(async (req: Request, res: Response) => {
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
  
  // Build base query with store filtering
  const baseQuery = buildBaseQuery(req);
  
  // Add text search
  const query = {
    ...baseQuery,
    $or: [
      { $text: { $search: searchTerm } },
      { name: { $regex: searchTerm, $options: "i" } },
      { description: { $regex: searchTerm, $options: "i" } },
      { tags: { $regex: searchTerm, $options: "i" } },
    ],
  };
  
  const catalogueProducts = await CatalogueProduct.find(query)
    .sort({ score: { $meta: "textScore" }, popularityIndex: -1 })
    .skip(skip)
    .limit(limit)
    .populate({
      path: "category",
      select: "name",
    })
    .populate({
      path: "store",
      select: "name logo",
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
});

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
      })
      .populate({
        path: "store",
        select: "name logo",
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

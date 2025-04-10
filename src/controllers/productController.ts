import { Request, Response, NextFunction } from "express";
import { Product } from "../models/Product";
import { ProductCategory } from "../models/ProductCategory";
import { Store } from "../models/Store";
import { ProductWishlist } from "../models/ProductWishlist";
import { Cart } from "../models/Cart";
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

// Helper function to build the base query for overall search with pincode filtering
const buildOverallSearchQuery = (req: Request) => {
  const pincode = req.query.pincode as string;

  if (!pincode) {
    return {};
  }

  // Find stores that serve this pincode
  return {
    $or: [
      { "store.serviceable_pincodes": pincode },
      { "store.isPanIndia": true },
    ],
  };
};

/**
 * Create a new product
 * @route POST /api/products
 * @access Private
 */
export const createProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;

    // Check if store exists and user is the owner
    const store = await Store.findById(req.body.store_id);
    if (!store) {
      return next(new AppError("Store not found", 404));
    }

    if (
      store.owner_id.toString() !== userId &&
      (req as any).user.role !== "admin"
    ) {
      return next(
        new AppError("You can only add products to your own store", 403)
      );
    }

    // Set store reference to match store_id
    req.body.store = req.body.store_id;

    // Create product
    const product = await Product.create(req.body);

    // Update product category count
    await ProductCategory.findByIdAndUpdate(product.category, {
      $inc: { noOfProducts: 1 },
    });

    res.status(201).json({
      status: "success",
      data: { product },
    });
  }
);

/**
 * Get all products
 * @route GET /api/products
 * @access Public
 */
export const getProducts = catchAsync(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;
  const userId = (req as any).user?.id;
  const userRole = (req as any).user?.role;

  const query = buildBaseQuery(req);

  const products = await Product.find(query)
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

  const total = await Product.countDocuments(query);

  // If user is a buyer, add inWishlist and quantityInCart fields
  if (userId && userRole === "user") {
    const productIds = products.map((product) => product._id);

    // Get wishlist information
    const wishlistItems = await ProductWishlist.find({
      user: userId,
      product: { $in: productIds },
      isDeleted: false,
    });

    const wishlistMap = new Map();
    wishlistItems.forEach((item) => {
      wishlistMap.set(item.product.toString(), true);
    });

    // Get cart information
    const cart = await Cart.findOne({
      user: userId,
      state: "active",
      isDeleted: false,
    });

    const cartMap = new Map();
    if (cart) {
      cart.items.forEach((item) => {
        cartMap.set(item.product.toString(), item.quantity);
      });
    }

    // Add fields to products
    const productsWithInfo = products.map((product) => {
      const productObj = product.toObject();
      productObj.inWishlist = wishlistMap.has(
        (product._id as mongoose.Types.ObjectId).toString()
      );
      productObj.quantityInCart =
        cartMap.get((product._id as mongoose.Types.ObjectId).toString()) || 0;
      return productObj;
    });

    return res.status(200).json({
      status: "success",
      results: productsWithInfo.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
      data: { products: productsWithInfo },
    });
  }

  res.status(200).json({
    status: "success",
    results: products.length,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
      limit,
    },
    data: { products },
  });
});

/**
 * Get a single product
 * @route GET /api/products/:id
 * @access Public
 */
export const getProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id;
    const userRole = (req as any).user?.role;

    const product = await Product.findById(req.params.id)
      .populate({
        path: "category",
        select: "name",
      })
      .populate({
        path: "store",
        select: "name logo",
      })
      .populate({
        path: "relatedCatalogueProductId",
        select: "name mainImage price sellingPrice",
      });

    if (!product) {
      return next(new AppError("Product not found", 404));
    }

    // If user is a buyer, add inWishlist and quantityInCart fields
    if (userId && userRole === "user") {
      const productObj = product.toObject();

      // Check if product is in wishlist
      const wishlistItem = await ProductWishlist.findOne({
        user: userId,
        product: product._id,
        isDeleted: false,
      });

      productObj.inWishlist = !!wishlistItem;

      // Check if product is in cart and get quantity
      const cart = await Cart.findOne({
        user: userId,
        state: "active",
        isDeleted: false,
      });

      let quantityInCart = 0;
      if (cart) {
        const cartItem = cart.items.find(
          (item) =>
            item.product.toString() ===
            (product._id as mongoose.Types.ObjectId).toString()
        );
        if (cartItem) {
          quantityInCart = cartItem.quantity;
        }
      }

      productObj.quantityInCart = quantityInCart;

      return res.status(200).json({
        status: "success",
        data: { product: productObj },
      });
    }

    res.status(200).json({
      status: "success",
      data: { product },
    });
  }
);

/**
 * Update a product
 * @route PATCH /api/products/:id
 * @access Private
 */
export const updateProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    const isAdmin = (req as any).user.role === "admin";

    // Find product
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new AppError("Product not found", 404));
    }

    // Check if user is the store owner or an admin
    const store = await Store.findById(product.store_id);
    if (!store) {
      return next(new AppError("Store not found", 404));
    }

    if (store.owner_id.toString() !== userId && !isAdmin) {
      return next(
        new AppError("You can only update products in your own store", 403)
      );
    }

    // Check if category is being changed
    const oldCategoryId = product.category;
    const newCategoryId = req.body.category;

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
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
      await ProductCategory.findByIdAndUpdate(oldCategoryId, {
        $inc: { noOfProducts: -1 },
      });

      await ProductCategory.findByIdAndUpdate(newCategoryId, {
        $inc: { noOfProducts: 1 },
      });
    }

    res.status(200).json({
      status: "success",
      data: { product: updatedProduct },
    });
  }
);

/**
 * Delete a product (soft delete)
 * @route DELETE /api/products/:id
 * @access Private
 */
export const deleteProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    const isAdmin = (req as any).user.role === "admin";

    // Find product
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new AppError("Product not found", 404));
    }

    // Check if user is the store owner or an admin
    const store = await Store.findById(product.store_id);
    if (!store) {
      return next(new AppError("Store not found", 404));
    }

    if (store.owner_id.toString() !== userId && !isAdmin) {
      return next(
        new AppError("You can only delete products in your own store", 403)
      );
    }

    // Soft delete
    product.isDeleted = true;
    product.deletedAt = new Date();
    await product.save();

    // Update category count
    await ProductCategory.findByIdAndUpdate(product.category, {
      $inc: { noOfProducts: -1 },
    });

    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);

/**
 * Restore a deleted product
 * @route PATCH /api/products/:id/restore
 * @access Private/Admin
 */
export const restoreProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const isAdmin = (req as any).user.role === "admin";

    if (!isAdmin) {
      return next(
        new AppError("Only admins can restore deleted products", 403)
      );
    }

    const product = await Product.findOne(
      { _id: req.params.id, isDeleted: true },
      null,
      { includeSoftDeleted: true }
    );

    if (!product) {
      return next(new AppError("Deleted product not found", 404));
    }

    // Restore
    product.isDeleted = false;
    product.deletedAt = undefined;
    await product.save();

    // Update category count
    await ProductCategory.findByIdAndUpdate(product.category, {
      $inc: { noOfProducts: 1 },
    });

    res.status(200).json({
      status: "success",
      data: { product },
    });
  }
);

/**
 * Get top selling products
 * @route GET /api/products/top-selling
 * @access Public
 */
export const getTopSellingProducts = catchAsync(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const query = buildBaseQuery(req);

    const products = await Product.find(query)
      .sort({ orderCount: -1, popularityIndex: -1 })
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

    const total = await Product.countDocuments(query);

    res.status(200).json({
      status: "success",
      results: products.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
      data: { products },
    });
  }
);

/**
 * Get best rated products
 * @route GET /api/products/best-rated
 * @access Public
 */
export const getBestRatedProducts = catchAsync(
  async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 10;
    const minReviews = parseInt(req.query.minReviews as string) || 5;
    const query = {
      ...buildBaseQuery(req),
      reviewCount: { $gte: minReviews },
    };

    const products = await Product.find(query)
      .sort({ averageRating: -1, reviewCount: -1 })
      .limit(limit)
      .populate({
        path: "category",
        select: "name",
      })
      .populate({
        path: "store",
        select: "name logo",
      });

    res.status(200).json({
      status: "success",
      results: products.length,
      data: { products },
    });
  }
);

/**
 * Get products by product category
 * @route GET /api/products/category/:categoryId
 * @access Public
 */
export const getProductsByProductCategory = catchAsync(
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

    const products = await Product.find(query)
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

    const total = await Product.countDocuments(query);

    res.status(200).json({
      status: "success",
      results: products.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
      data: { products },
    });
  }
);

/**
 * Get products by favourite count
 * @route GET /api/products/by-favourite
 * @access Public
 */
export const getProductsByFavouriteCount = catchAsync(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const query = buildBaseQuery(req);

    const products = await Product.find(query)
      .sort({ wishlistCount: -1, popularityIndex: -1 })
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

    const total = await Product.countDocuments(query);

    res.status(200).json({
      status: "success",
      results: products.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
      data: { products },
    });
  }
);

/**
 * Search store products
 * @route GET /api/products/search
 * @access Public
 */
export const searchStoreProducts = catchAsync(
  async (req: Request, res: Response) => {
    const searchTerm = req.query.q as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    if (!searchTerm) {
      return res.status(200).json({
        status: "success",
        results: 0,
        data: { products: [] },
      });
    }

    // Build base query with store filtering
    const baseQuery = buildBaseQuery(req);

    // Try text search first
    let products = [];
    let total = 0;

    try {
      // First attempt: Use text search with proper index
      const textQuery = {
        ...baseQuery,
        $text: { $search: searchTerm },
        isDeleted: false,
      };

      products = await Product.find(textQuery)
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

      total = await Product.countDocuments(textQuery);
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

      products = await Product.find(regexQuery)
        .sort({ popularityIndex: -1 })
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

      total = await Product.countDocuments(regexQuery);
    }

    res.status(200).json({
      status: "success",
      results: products.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
      data: { products },
    });
  }
);

/**
 * Search products overall (across all stores with pincode filter)
 * @route GET /api/products/search-overall
 * @access Public
 */
export const searchProductsOverall = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const searchTerm = req.query.q as string;
    const pincode = req.query.pincode as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    if (!searchTerm) {
      return res.status(200).json({
        status: "success",
        results: 0,
        data: { products: [] },
      });
    }

    if (!pincode) {
      return next(new AppError("Pincode is required for overall search", 400));
    }

    // Find stores that serve this pincode
    const stores = await Store.find({
      $or: [{ serviceable_pincodes: pincode }, { isPanIndia: true }],
      isDeleted: false,
    }).select("_id");

    const storeIds = stores.map((store) => store._id);

    // Try text search first
    let products = [];
    let total = 0;

    try {
      // First attempt: Use text search with proper index
      const textQuery = {
        store_id: { $in: storeIds },
        $text: { $search: searchTerm },
        isDeleted: false,
      };

      products = await Product.find(textQuery)
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

      total = await Product.countDocuments(textQuery);
    } catch (error) {
      // If text search fails, fallback to regex search
      const regexQuery = {
        store_id: { $in: storeIds },
        isDeleted: false,
        $or: [
          { name: { $regex: searchTerm, $options: "i" } },
          { description: { $regex: searchTerm, $options: "i" } },
          { tags: { $regex: searchTerm, $options: "i" } },
        ],
      };

      products = await Product.find(regexQuery)
        .sort({ popularityIndex: -1 })
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

      total = await Product.countDocuments(regexQuery);
    }

    res.status(200).json({
      status: "success",
      results: products.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
      data: { products },
    });
  }
);

/**
 * Get products by store
 * @route GET /api/stores/:storeId/products
 * @access Public
 */
export const getStoreProducts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const storeId = req.params.storeId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const userId = (req as any).user?.id;
    const userRole = (req as any).user?.role;

    // Check if store exists
    const store = await Store.findById(storeId);
    if (!store) {
      return next(new AppError("Store not found", 404));
    }

    const products = await Product.find({ store_id: storeId })
      .sort({ popularityIndex: -1, orderCount: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "category",
        select: "name",
      });

    const total = await Product.countDocuments({ store_id: storeId });

    // If user is a buyer, add inWishlist and quantityInCart fields
    if (userId && userRole === "user") {
      const productIds = products.map((product) => product._id);

      // Get wishlist information
      const wishlistItems = await ProductWishlist.find({
        user: userId,
        product: { $in: productIds },
        isDeleted: false,
      });

      const wishlistMap = new Map();
      wishlistItems.forEach((item) => {
        wishlistMap.set(item.product.toString(), true);
      });

      // Get cart information
      const cart = await Cart.findOne({
        user: userId,
        state: "active",
        isDeleted: false,
      });

      const cartMap = new Map();
      if (cart) {
        cart.items.forEach((item) => {
          cartMap.set(item.product.toString(), item.quantity);
        });
      }

      // Add fields to products
      const productsWithInfo = products.map((product) => {
        const productObj = product.toObject();
        productObj.inWishlist = wishlistMap.has(
          (product._id as mongoose.Types.ObjectId).toString()
        );
        productObj.quantityInCart =
          cartMap.get((product._id as mongoose.Types.ObjectId).toString()) || 0;
        return productObj;
      });

      return res.status(200).json({
        status: "success",
        results: productsWithInfo.length,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
          limit,
        },
        data: { products: productsWithInfo },
      });
    }

    res.status(200).json({
      status: "success",
      results: products.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
      data: { products },
    });
  }
);

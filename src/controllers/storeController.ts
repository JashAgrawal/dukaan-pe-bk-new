import { Request, Response, NextFunction } from "express";
import { Store } from "../models/Store";
import { StoreCategory } from "../models/StoreCategory";
import { ProductCategory } from "../models/ProductCategory";
import { StoreWishlist } from "../models/StoreWishlist";
import { AppError, catchAsync } from "../middlewares/errorHandler";
import mongoose from "mongoose";

// Helper function to build the base query with pincode filtering
const buildBaseQuery = (req: Request) => {
  const pincode = req.query.pincode as string;
  const isBrand = req.query.isBrand === "true";

  let query: any = {};

  // Filter by pincode if provided
  if (pincode) {
    query.$or = [{ serviceable_pincodes: pincode }, { isPanIndia: true }];
  }

  // Filter by brand if requested
  if (isBrand) {
    query.isBrand = true;
  }

  return query;
};

/**
 * Create a new store
 * @route POST /api/stores
 * @access Private
 */
export const createStore = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;

    // Validate that if isBrand is true, isPanIndia must be true
    if (req.body.isBrand && !req.body.isPanIndia) {
      req.body.isPanIndia = true;
    }

    // Create store
    const store = await Store.create({
      ...req.body,
      owner_id: userId,
    });

    // Update store category count
    await StoreCategory.findByIdAndUpdate(store.category, {
      $inc: { noOfStores: 1 },
    });

    res.status(201).json({
      status: "success",
      data: { store },
    });
  }
);

/**
 * Get all stores
 * @route GET /api/stores
 * @access Public
 */
export const getStores = catchAsync(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;
  const userId = (req as any).user?.id;
  const userRole = (req as any).user?.role;

  const query = buildBaseQuery(req);

  const stores = await Store.find(query)
    .sort({ popularity_index: -1, orderCount: -1 })
    .skip(skip)
    .limit(limit)
    .populate({
      path: "category",
      select: "name",
    })
    .populate({
      path: "productCategories",
      select: "name",
    });

  const total = await Store.countDocuments(query);

  // If user is a buyer, add inWishlist field
  if (userId && userRole === "user") {
    const storeIds = stores.map((store) => store._id);

    // Get wishlist information
    const wishlistItems = await StoreWishlist.find({
      user: userId,
      store: { $in: storeIds },
      isDeleted: false,
    });

    const wishlistMap = new Map();
    wishlistItems.forEach((item) => {
      wishlistMap.set(item.store.toString(), true);
    });

    // Add fields to stores
    const storesWithInfo = stores.map((store) => {
      const storeObj = store.toObject();
      storeObj.inWishlist = wishlistMap.has(
        (store._id as mongoose.Types.ObjectId).toString()
      );
      return storeObj;
    });

    return res.status(200).json({
      status: "success",
      results: storesWithInfo.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
      data: { stores: storesWithInfo },
    });
  }

  res.status(200).json({
    status: "success",
    results: stores.length,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
      limit,
    },
    data: { stores },
  });
});

/**
 * Get a single store
 * @route GET /api/stores/:id
 * @access Public
 */
export const getStore = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id;
    const userRole = (req as any).user?.role;

    const store = await Store.findById(req.params.id)
      .populate({
        path: "category",
        select: "name",
      })
      .populate({
        path: "productCategories",
        select: "name",
      });

    if (!store) {
      return next(new AppError("Store not found", 404));
    }

    // If user is a buyer, add inWishlist field
    if (userId && userRole === "user") {
      const storeObj = store.toObject();

      // Check if store is in wishlist
      const wishlistItem = await StoreWishlist.findOne({
        user: userId,
        store: store._id,
        isDeleted: false,
      });

      storeObj.inWishlist = !!wishlistItem;

      return res.status(200).json({
        status: "success",
        data: { store: storeObj },
      });
    }

    res.status(200).json({
      status: "success",
      data: { store },
    });
  }
);

/**
 * Update a store
 * @route PATCH /api/stores/:id
 * @access Private
 */
export const updateStore = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    const isAdmin = (req as any).user.role === "admin";

    // Find store
    const store = await Store.findById(req.params.id);

    if (!store) {
      return next(new AppError("Store not found", 404));
    }

    // Check if user is the owner or an admin
    if (store.owner_id.toString() !== userId && !isAdmin) {
      return next(new AppError("You can only update your own stores", 403));
    }

    // Validate that if isBrand is true, isPanIndia must be true
    if (req.body.isBrand && !req.body.isPanIndia) {
      req.body.isPanIndia = true;
    }

    // Check if category is being changed
    const oldCategoryId = store.category;
    const newCategoryId = req.body.category;

    // Update store
    const updatedStore = await Store.findByIdAndUpdate(
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
        path: "productCategories",
        select: "name",
      });

    // Update category counts if category changed
    if (newCategoryId && oldCategoryId.toString() !== newCategoryId) {
      await StoreCategory.findByIdAndUpdate(oldCategoryId, {
        $inc: { noOfStores: -1 },
      });

      await StoreCategory.findByIdAndUpdate(newCategoryId, {
        $inc: { noOfStores: 1 },
      });
    }

    res.status(200).json({
      status: "success",
      data: { store: updatedStore },
    });
  }
);

/**
 * Delete a store (soft delete)
 * @route DELETE /api/stores/:id
 * @access Private
 */
export const deleteStore = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    const isAdmin = (req as any).user.role === "admin";

    // Find store
    const store = await Store.findById(req.params.id);

    if (!store) {
      return next(new AppError("Store not found", 404));
    }

    // Check if user is the owner or an admin
    if (store.owner_id.toString() !== userId && !isAdmin) {
      return next(new AppError("You can only delete your own stores", 403));
    }

    // Soft delete
    store.isDeleted = true;
    store.deletedAt = new Date();
    await store.save();

    // Update category count
    await StoreCategory.findByIdAndUpdate(store.category, {
      $inc: { noOfStores: -1 },
    });

    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);

/**
 * Restore a deleted store
 * @route PATCH /api/stores/:id/restore
 * @access Private/Admin
 */
export const restoreStore = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const isAdmin = (req as any).user.role === "admin";

    if (!isAdmin) {
      return next(new AppError("Only admins can restore deleted stores", 403));
    }

    const store = await Store.findOne(
      { _id: req.params.id, isDeleted: true },
      null,
      { includeSoftDeleted: true }
    );

    if (!store) {
      return next(new AppError("Deleted store not found", 404));
    }

    // Restore
    store.isDeleted = false;
    store.deletedAt = undefined;
    await store.save();

    // Update category count
    await StoreCategory.findByIdAndUpdate(store.category, {
      $inc: { noOfStores: 1 },
    });

    res.status(200).json({
      status: "success",
      data: { store },
    });
  }
);

/**
 * Get top selling stores
 * @route GET /api/stores/top-selling
 * @access Public
 */
export const getTopSellingStores = catchAsync(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const query = buildBaseQuery(req);

    const stores = await Store.find(query)
      .sort({ orderCount: -1, popularity_index: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "category",
        select: "name",
      });

    const total = await Store.countDocuments(query);

    res.status(200).json({
      status: "success",
      results: stores.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
      data: { stores },
    });
  }
);

/**
 * Get best rated stores
 * @route GET /api/stores/best-rated
 * @access Public
 */
export const getBestRatedStores = catchAsync(
  async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 10;
    const minReviews = parseInt(req.query.minReviews as string) || 5;
    const query = {
      ...buildBaseQuery(req),
      reviewCount: { $gte: minReviews },
    };

    const stores = await Store.find(query)
      .sort({ averageRating: -1, reviewCount: -1 })
      .limit(limit)
      .populate({
        path: "category",
        select: "name",
      });

    res.status(200).json({
      status: "success",
      results: stores.length,
      data: { stores },
    });
  }
);

/**
 * Get nearby stores
 * @route GET /api/stores/nearby
 * @access Public
 */
export const getNearbyStores = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { latitude, longitude, maxDistance } = req.query;

    if (!latitude || !longitude) {
      return next(new AppError("Please provide latitude and longitude", 400));
    }

    const lat = parseFloat(latitude as string);
    const lng = parseFloat(longitude as string);
    const distance = parseFloat(maxDistance as string) || 10000; // Default 10km

    const query = {
      ...buildBaseQuery(req),
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
          $maxDistance: distance,
        },
      },
    };

    const stores = await Store.find(query).limit(20).populate({
      path: "category",
      select: "name",
    });

    res.status(200).json({
      status: "success",
      results: stores.length,
      data: { stores },
    });
  }
);

/**
 * Get stores by category
 * @route GET /api/stores/category/:categoryId
 * @access Public
 */
export const getStoresByCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const categoryId = req.params.categoryId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Check if category exists
    const category = await StoreCategory.findById(categoryId);
    if (!category) {
      return next(new AppError("Category not found", 404));
    }

    // Get all subcategories of this category
    const subcategories = await StoreCategory.find({ parentId: categoryId });
    const subcategoryIds = subcategories.map((subcat) => subcat._id);

    // Include the main category and all its subcategories in the query
    const categoryIds = [categoryId, ...subcategoryIds];

    const query = {
      ...buildBaseQuery(req),
      category: { $in: categoryIds },
    };

    const stores = await Store.find(query)
      .sort({ popularity_index: -1, orderCount: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "category",
        select: "name",
      });

    const total = await Store.countDocuments(query);

    res.status(200).json({
      status: "success",
      results: stores.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
      data: { stores },
    });
  }
);

/**
 * Get stores by product category
 * @route GET /api/stores/product-category/:categoryId
 * @access Public
 */
export const getStoresByProductCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const categoryId = req.params.categoryId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Check if product category exists
    const category = await ProductCategory.findById(categoryId);
    if (!category) {
      return next(new AppError("Product category not found", 404));
    }

    // Get all subcategories of this product category
    const subcategories = await ProductCategory.find({ parentId: categoryId });
    const subcategoryIds = subcategories.map((subcat) => subcat._id);

    // Include the main category and all its subcategories in the query
    const categoryIds = [categoryId, ...subcategoryIds];

    const query = {
      ...buildBaseQuery(req),
      productCategories: { $in: categoryIds },
    };

    const stores = await Store.find(query)
      .sort({ popularity_index: -1, orderCount: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "category",
        select: "name",
      })
      .populate({
        path: "productCategories",
        select: "name",
      });

    const total = await Store.countDocuments(query);

    res.status(200).json({
      status: "success",
      results: stores.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
      data: { stores },
    });
  }
);

/**
 * Get stores by service type
 * @route GET /api/stores/service-type/:type
 * @access Public
 */
export const getStoresByServiceType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const serviceType = req.params.type;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Validate service type
    const validTypes = [
      "physical_product",
      "digital_product",
      "service",
      "restaurant",
      "infomercial",
    ];

    if (!validTypes.includes(serviceType)) {
      return next(
        new AppError(
          `Invalid service type. Must be one of: ${validTypes.join(", ")}`,
          400
        )
      );
    }

    const query = {
      ...buildBaseQuery(req),
      type: serviceType,
    };

    const stores = await Store.find(query)
      .sort({ popularity_index: -1, orderCount: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "category",
        select: "name",
      });

    const total = await Store.countDocuments(query);

    res.status(200).json({
      status: "success",
      results: stores.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
      data: { stores },
    });
  }
);

/**
 * Get stores by favourite count
 * @route GET /api/stores/by-favourite
 * @access Public
 */
export const getStoresByFavouriteCount = catchAsync(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const query = buildBaseQuery(req);

    const stores = await Store.find(query)
      .sort({ wishlistCount: -1, popularity_index: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "category",
        select: "name",
      });

    const total = await Store.countDocuments(query);

    res.status(200).json({
      status: "success",
      results: stores.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
      data: { stores },
    });
  }
);

/**
 * Search stores
 * @route GET /api/stores/search
 * @access Public
 */
/**
 * Search stores with filters and sorting
 * @route GET /api/stores/search-with-filters
 * @access Public
 */
export const searchStoresWithFilters = catchAsync(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Extract filter parameters
    const query = req.query.query as string;
    const categoryIds = req.query.categoryIds
      ? (req.query.categoryIds as string).split(",")
      : [];
    const tags = req.query.tags ? (req.query.tags as string).split(",") : [];
    const type = req.query.type as string;
    const isOpen = req.query.isOpen === "true";
    const isBrand = req.query.isBrand === "true";
    const isPanIndia = req.query.isPanIndia === "true";
    const pincode = req.query.pincode as string;
    const sortBy = (req.query.sortBy as string) || "popularity";

    // Build filter query
    const filterQuery: any = { isDeleted: false };

    // Add text search if query provided
    if (query) {
      filterQuery.$or = [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { tagline: { $regex: query, $options: "i" } },
      ];
    }

    // Add category filter
    if (categoryIds.length > 0) {
      // Get all subcategories of the selected categories
      const subcategories = await StoreCategory.find({
        parentId: { $in: categoryIds },
      });
      const subcategoryIds = subcategories.map((subcat) =>
        (subcat._id as mongoose.Types.ObjectId).toString()
      );

      // Include both parent categories and their subcategories
      const allCategoryIds = [...categoryIds, ...subcategoryIds];
      filterQuery.category = { $in: allCategoryIds };
    }

    // Add type filter
    if (type) {
      filterQuery.type = type;
    }

    // Add isOpen filter
    if (req.query.isOpen !== undefined) {
      filterQuery.isOpen = isOpen;
    }

    // Add isBrand filter
    if (req.query.isBrand !== undefined) {
      filterQuery.isBrand = isBrand;
    }

    // Add isPanIndia filter
    if (req.query.isPanIndia !== undefined) {
      filterQuery.isPanIndia = isPanIndia;
    }

    // Add pincode filter
    if (pincode) {
      filterQuery.$or = filterQuery.$or || [];
      filterQuery.$or.push(
        { serviceable_pincodes: pincode },
        { isPanIndia: true }
      );
    }

    // Determine sort order
    let sortOptions: any = {};
    switch (sortBy) {
      case "nearest":
        // For nearest, we need coordinates which should be handled separately
        // This is a placeholder - actual implementation would use geospatial queries
        sortOptions = { popularity_index: -1 };
        break;
      case "avgRating":
        sortOptions = { averageRating: -1, reviewCount: -1 };
        break;
      case "popularity":
      default:
        sortOptions = { popularity_index: -1, orderCount: -1 };
        break;
    }

    // Execute query
    const stores = await Store.find(filterQuery)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .populate({
        path: "category",
        select: "name",
      })
      .populate({
        path: "productCategories",
        select: "name",
      });

    const total = await Store.countDocuments(filterQuery);

    res.status(200).json({
      status: "success",
      results: stores.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
      data: { stores },
    });
  }
);

export const searchStores = catchAsync(async (req: Request, res: Response) => {
  const searchTerm = req.query.q as string;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  if (!searchTerm) {
    return res.status(200).json({
      status: "success",
      results: 0,
      data: { stores: [] },
    });
  }

  // Build base query with pincode filtering
  const baseQuery = buildBaseQuery(req);

  // Try text search first
  let stores = [];
  let total = 0;

  try {
    // First attempt: Use text search with proper index
    const textQuery = {
      ...baseQuery,
      $text: { $search: searchTerm },
      isDeleted: false,
    };

    stores = await Store.find(textQuery)
      .sort({ score: { $meta: "textScore" }, popularity_index: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "category",
        select: "name",
      })
      .populate({
        path: "productCategories",
        select: "name",
      });

    total = await Store.countDocuments(textQuery);
  } catch (error) {
    // If text search fails, fallback to regex search
    const regexQuery = {
      ...baseQuery,
      isDeleted: false,
      $or: [
        { name: { $regex: searchTerm, $options: "i" } },
        { tagline: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } },
      ],
    };

    stores = await Store.find(regexQuery)
      .sort({ popularity_index: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "category",
        select: "name",
      })
      .populate({
        path: "productCategories",
        select: "name",
      });

    total = await Store.countDocuments(regexQuery);
  }

  res.status(200).json({
    status: "success",
    results: stores.length,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
      limit,
    },
    data: { stores },
  });
});

/**
 * Get stores owned by the current user
 * @route GET /api/stores/my-stores
 * @access Private
 */
export const getMyStores = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const stores = await Store.find({ owner_id: userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate({
      path: "category",
      select: "name",
    })
    .populate({
      path: "productCategories",
      select: "name",
    });

  const total = await Store.countDocuments({ owner_id: userId });

  res.status(200).json({
    status: "success",
    results: stores.length,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
      limit,
    },
    data: { stores },
  });
});

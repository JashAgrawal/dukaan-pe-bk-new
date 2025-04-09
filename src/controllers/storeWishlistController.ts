import { Request, Response, NextFunction } from "express";
import { StoreWishlist } from "../models/StoreWishlist";
import { Store } from "../models/Store";
import { AppError, catchAsync } from "../middlewares/errorHandler";

/**
 * Add a store to wishlist
 * @route POST /api/store-wishlist
 * @access Private
 */
export const addToWishlist = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    const { store } = req.body;

    // Check if store exists
    const storeExists = await Store.findById(store);
    if (!storeExists) {
      return next(new AppError("Store not found", 404));
    }

    // Check if already in wishlist
    const existingWishlist = await StoreWishlist.findOne({
      store,
      user: userId,
    });

    if (existingWishlist) {
      // If it was soft-deleted, restore it
      if (existingWishlist.isDeleted) {
        existingWishlist.isDeleted = false;
        existingWishlist.deletedAt = undefined;
        await existingWishlist.save();

        return res.status(200).json({
          status: "success",
          data: { wishlist: existingWishlist },
        });
      }

      return next(new AppError("Store is already in your wishlist", 400));
    }

    // Add to wishlist
    const wishlist = await StoreWishlist.create({
      store,
      user: userId,
    });

    res.status(201).json({
      status: "success",
      data: { wishlist },
    });
  }
);

/**
 * Remove a store from wishlist
 * @route DELETE /api/store-wishlist/:storeId
 * @access Private
 */
export const removeFromWishlist = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    const storeId = req.params.storeId;

    const wishlist = await StoreWishlist.findOne({
      store: storeId,
      user: userId,
      isDeleted: false,
    });

    if (!wishlist) {
      return next(new AppError("Store not found in your wishlist", 404));
    }

    // Soft delete
    wishlist.isDeleted = true;
    wishlist.deletedAt = new Date();
    await wishlist.save();

    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);

/**
 * Get user's wishlist
 * @route GET /api/store-wishlist
 * @access Private
 */
export const getWishlist = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const wishlist = await StoreWishlist.find({ user: userId, isDeleted: false })
    .populate({
      path: "store",
      select: "name logo mainImage tagline averageRating reviewCount",
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await StoreWishlist.countDocuments({
    user: userId,
    isDeleted: false,
  });

  res.status(200).json({
    status: "success",
    results: wishlist.length,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
      limit,
    },
    data: { wishlist },
  });
});

/**
 * Check if a store is in user's wishlist
 * @route GET /api/store-wishlist/check/:storeId
 * @access Private
 */
export const checkWishlist = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    const storeId = req.params.storeId;

    // Check if store exists
    const store = await Store.findById(storeId);
    if (!store) {
      return next(new AppError("Store not found", 404));
    }

    const wishlist = await StoreWishlist.findOne({
      store: storeId,
      user: userId,
      isDeleted: false,
    });

    res.status(200).json({
      status: "success",
      data: {
        inWishlist: !!wishlist,
      },
    });
  }
);

/**
 * Get stores with highest wishlist counts
 * @route GET /api/store-wishlist/popular
 * @access Public
 */
export const getPopularWishlistedStores = catchAsync(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const pincode = req.query.pincode as string;
    const isBrand = req.query.isBrand === "true";

    // Build query
    let query: any = {};

    // Filter by pincode if provided
    if (pincode) {
      query.$or = [{ serviceable_pincodes: pincode }, { isPanIndia: true }];
    }

    // Filter by brand if requested
    if (isBrand) {
      query.isBrand = true;
    }

    const stores = await Store.find(query)
      .sort({ wishlistCount: -1, popularity_index: -1 })
      .skip(skip)
      .limit(limit)
      .select(
        "name logo mainImage tagline averageRating reviewCount wishlistCount"
      );

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

import { Request, Response, NextFunction } from "express";
import { ProductWishlist } from "../models/ProductWishlist";
import { Product } from "../models/Product";
import { AppError, catchAsync } from "../middlewares/errorHandler";

/**
 * Add a product to wishlist
 * @route POST /api/product-wishlist
 * @access Private
 */
export const addToWishlist = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    const { product } = req.body;

    // Check if product exists
    const productExists = await Product.findById(product);
    if (!productExists) {
      return next(new AppError("Product not found", 404));
    }

    // Check if already in wishlist
    const existingWishlist = await ProductWishlist.findOne({
      product,
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

      return next(
        new AppError("Product is already in your wishlist", 400)
      );
    }

    // Add to wishlist
    const wishlist = await ProductWishlist.create({
      product,
      user: userId,
    });

    res.status(201).json({
      status: "success",
      data: { wishlist },
    });
  }
);

/**
 * Remove a product from wishlist
 * @route DELETE /api/product-wishlist/:productId
 * @access Private
 */
export const removeFromWishlist = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    const productId = req.params.productId;

    const wishlist = await ProductWishlist.findOne({
      product: productId,
      user: userId,
      isDeleted: false,
    });

    if (!wishlist) {
      return next(new AppError("Product not found in your wishlist", 404));
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
 * @route GET /api/product-wishlist
 * @access Private
 */
export const getWishlist = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  const wishlist = await ProductWishlist.find({ user: userId })
    .populate({
      path: "product",
      select: "name mainImage price sellingPrice discountPercentage averageRating reviewCount",
    })
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    results: wishlist.length,
    data: { wishlist },
  });
});

/**
 * Check if a product is in user's wishlist
 * @route GET /api/product-wishlist/check/:productId
 * @access Private
 */
export const checkWishlist = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    const productId = req.params.productId;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return next(new AppError("Product not found", 404));
    }

    const wishlist = await ProductWishlist.findOne({
      product: productId,
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
 * Get products with highest wishlist counts
 * @route GET /api/product-wishlist/popular
 * @access Public
 */
export const getPopularWishlistedProducts = catchAsync(
  async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 10;
    const storeId = req.query.store_id as string;

    // Build query
    let query: any = {};
    
    // Filter by store if provided
    if (storeId) {
      query.store_id = storeId;
    }

    const products = await Product.find(query)
      .sort({ wishlistCount: -1, popularityIndex: -1 })
      .limit(limit)
      .select("name mainImage price sellingPrice discountPercentage averageRating reviewCount wishlistCount");

    res.status(200).json({
      status: "success",
      results: products.length,
      data: { products },
    });
  }
);

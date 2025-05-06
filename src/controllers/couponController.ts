import { Request, Response, NextFunction } from "express";
import { Coupon } from "../models/Coupon";
import { Store } from "../models/Store";
import { Product } from "../models/Product";
import { Cart } from "../models/Cart";
import { AppError, catchAsync } from "../middlewares/errorHandler";

/**
 * Create a new coupon
 * @route POST /api/coupons
 * @access Private (Store Owner)
 */
export const createCoupon = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    const { store, products } = req.body;

    // Check if store exists and user is the owner
    const storeDoc = await Store.findById(store);
    if (!storeDoc) {
      return next(new AppError("Store not found", 404));
    }

    if (storeDoc.owner_id.toString() !== userId) {
      return next(
        new AppError("You are not authorized to create coupons for this store", 403)
      );
    }

    // Validate products if provided
    if (products && products.length > 0) {
      const productCount = await Product.countDocuments({
        _id: { $in: products },
        store_id: store,
        isDeleted: false,
      });

      if (productCount !== products.length) {
        return next(
          new AppError(
            "One or more products do not exist or do not belong to this store",
            400
          )
        );
      }
    }

    // Check if coupon code already exists for this store
    const existingCoupon = await Coupon.findOne({
      store,
      code: req.body.code.toUpperCase(),
      isDeleted: false,
    });

    if (existingCoupon) {
      return next(
        new AppError("A coupon with this code already exists for this store", 400)
      );
    }

    // Create coupon
    const coupon = await Coupon.create({
      ...req.body,
      code: req.body.code.toUpperCase(),
    });

    res.status(201).json({
      status: "success",
      data: { coupon },
    });
  }
);

/**
 * Get all coupons for a store
 * @route GET /api/coupons
 * @access Private (Store Owner)
 */
export const getCoupons = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const storeId = req.query.store as string;

  console.log(storeId)
  // If storeId is provided, check if user is the owner
  // if (storeId) {
  //   const store = await Store.findById(storeId);
  //   if (store && store.owner_id.toString() !== userId) {
  //     return res.status(403).json({
  //       status: "error",
  //       message: "You are not authorized to view coupons for this store",
  //     });
  //   }
  // }

  // Build query
  const query: any = {};

  if (storeId) {
    query.store = storeId;
  } else {
    // If no storeId provided, get all coupons for stores owned by the user
    const stores = await Store.find({ owner_id: userId });
    const storeIds = stores.map(store => store._id);
    query.store = { $in: storeIds };
  }
  const coupons = await Coupon.find(query)
    .populate({
      path: "products",
      select: "name mainImage price sellingPrice",
    })
    .sort({ createdAt: -1 });
    console.log(coupons);

  res.status(200).json({
    status: "success",
    results: coupons.length,
    data: { coupons },
  });
});

/**
 * Get a single coupon
 * @route GET /api/coupons/:id
 * @access Private (Store Owner)
 */
export const getCoupon = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    const couponId = req.params.id;

    const coupon = await Coupon.findById(couponId).populate({
      path: "products",
      select: "name mainImage price sellingPrice",
    });

    if (!coupon) {
      return next(new AppError("Coupon not found", 404));
    }

    // Check if user is the store owner
    const store = await Store.findById(coupon.store);
    if (!store || store.owner_id.toString() !== userId) {
      return next(
        new AppError("You are not authorized to view this coupon", 403)
      );
    }

    res.status(200).json({
      status: "success",
      data: { coupon },
    });
  }
);

/**
 * Update a coupon
 * @route PATCH /api/coupons/:id
 * @access Private (Store Owner)
 */
export const updateCoupon = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    const couponId = req.params.id;

    // Find the coupon
    const coupon = await Coupon.findById(couponId);
    if (!coupon) {
      return next(new AppError("Coupon not found", 404));
    }

    // Check if user is the store owner
    const store = await Store.findById(coupon.store);
    if (!store || store.owner_id.toString() !== userId) {
      return next(
        new AppError("You are not authorized to update this coupon", 403)
      );
    }

    // Validate products if provided
    if (req.body.products && req.body.products.length > 0) {
      const productCount = await Product.countDocuments({
        _id: { $in: req.body.products },
        store_id: coupon.store,
        isDeleted: false,
      });

      if (productCount !== req.body.products.length) {
        return next(
          new AppError(
            "One or more products do not exist or do not belong to this store",
            400
          )
        );
      }
    }

    // If code is being updated, check if it already exists
    if (req.body.code && req.body.code !== coupon.code) {
      const existingCoupon = await Coupon.findOne({
        store: coupon.store,
        code: req.body.code.toUpperCase(),
        _id: { $ne: couponId },
        isDeleted: false,
      });

      if (existingCoupon) {
        return next(
          new AppError("A coupon with this code already exists for this store", 400)
        );
      }

      // Convert code to uppercase
      req.body.code = req.body.code.toUpperCase();
    }

    // Update coupon
    const updatedCoupon = await Coupon.findByIdAndUpdate(
      couponId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate({
      path: "products",
      select: "name mainImage price sellingPrice",
    });

    res.status(200).json({
      status: "success",
      data: { coupon: updatedCoupon },
    });
  }
);

/**
 * Delete a coupon
 * @route DELETE /api/coupons/:id
 * @access Private (Store Owner)
 */
export const deleteCoupon = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    const couponId = req.params.id;

    // Find the coupon
    const coupon = await Coupon.findById(couponId);
    if (!coupon) {
      return next(new AppError("Coupon not found", 404));
    }

    // Check if user is the store owner
    const store = await Store.findById(coupon.store);
    if (!store || store.owner_id.toString() !== userId) {
      return next(
        new AppError("You are not authorized to delete this coupon", 403)
      );
    }

    // Soft delete
    coupon.isDeleted = true;
    coupon.deletedAt = new Date();
    await coupon.save();

    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);

/**
 * Get available coupons for a store and cart
 * @route GET /api/coupons/available
 * @access Private
 */
export const getAvailableCoupons = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const storeId = req.query.storeId as string;
    const cartId = req.query.cartId as string;

    if (!storeId) {
      return next(new AppError("Store ID is required", 400));
    }

    // Check if store exists
    const store = await Store.findById(storeId);
    if (!store) {
      return next(new AppError("Store not found", 404));
    }

    // Find all active coupons for the store
    const coupons = await Coupon.find({
      store: storeId,
      isActive: true,
      isDeleted: false,
    }).populate({
      path: "products",
      select: "name mainImage price sellingPrice",
    });

    // If cartId is provided, check which coupons are applicable to the cart
    let applicableCoupons = coupons;

    if (cartId) {
      const cart = await Cart.findById(cartId).populate({
        path: "items.product",
        select: "name mainImage price sellingPrice",
      });

      if (!cart) {
        return next(new AppError("Cart not found", 404));
      }

      // Filter coupons that are applicable to the cart
      applicableCoupons = coupons.filter((coupon) => {
        // If coupon has specific products, check if any of them are in the cart
        if (coupon.products && coupon.products.length > 0) {
          const cartProductIds = cart.items.map((item) => {
            const product = item.product as any;
            return product._id.toString();
          });

          const couponProductIds = coupon.products.map((product: any) =>
            product._id ? product._id.toString() : product.toString()
          );

          // Check if any product in the coupon is also in the cart
          return couponProductIds.some((productId: string) =>
            cartProductIds.includes(productId)
          );
        }

        // If coupon doesn't have specific products, it's applicable to all products
        return true;
      });
    }

    res.status(200).json({
      success: true,
      data: {
        coupons: applicableCoupons.map((coupon) => ({
          id: coupon._id,
          code: coupon.code,
          type: coupon.type,
          discountAmt: coupon.discountAmt,
          discountPercentage: coupon.discountPercentage,
          maxDiscount: coupon.maxDiscount,
          products: coupon.products,
        })),
      },
    });
  }
);

/**
 * Validate a coupon code for a specific store and cart
 * @route POST /api/coupons/validate
 * @access Private
 */
export const validateCouponForCart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { couponCode, storeId, cartId } = req.body;

    if (!couponCode) {
      return next(new AppError("Coupon code is required", 400));
    }

    if (!storeId) {
      return next(new AppError("Store ID is required", 400));
    }

    // Find the coupon
    const coupon = await Coupon.findOne({
      code: couponCode.toUpperCase(),
      store: storeId,
      isActive: true,
      isDeleted: false,
    });

    if (!coupon) {
      return next(new AppError("Invalid coupon code", 404));
    }

    // If cartId is provided, check if the coupon is applicable to the cart
    if (cartId) {
      const cart = await Cart.findById(cartId).populate({
        path: "items.product",
        select: "name mainImage price sellingPrice",
      });

      if (!cart) {
        return next(new AppError("Cart not found", 404));
      }

      // If coupon has specific products, check if any of them are in the cart
      if (coupon.products && coupon.products.length > 0) {
        const cartProductIds = cart.items.map((item) => {
          const product = item.product as any;
          return product._id.toString();
        });

        const couponProductIds = coupon.products.map((product: any) =>
          product._id ? product._id.toString() : product.toString()
        );

        // Check if any product in the coupon is also in the cart
        const isApplicable = couponProductIds.some((productId: string) =>
          cartProductIds.includes(productId)
        );

        if (!isApplicable) {
          return next(new AppError("This coupon is not applicable to the items in your cart", 400));
        }
      }

      // Calculate the discount amount
      let totalDiscount = 0;
      let discountDetails = [];

      for (const item of cart.items) {
        const product = item.product as any;
        const isProductInCoupon = coupon.products.length === 0 ||
          coupon.products.some((p: any) =>
            (p._id ? p._id.toString() : p.toString()) === product._id.toString()
          );

        if (isProductInCoupon) {
          let itemDiscount = 0;

          if (coupon.type === "percentage") {
            itemDiscount = Math.min(
              (product.sellingPrice * coupon.discountPercentage) / 100 * item.quantity,
              (coupon.maxDiscount || Infinity) * item.quantity
            );
          } else {
            itemDiscount = Math.min(
              coupon.discountAmt * item.quantity,
              product.sellingPrice * item.quantity
            );
          }

          totalDiscount += itemDiscount;

          discountDetails.push({
            product: {
              id: product._id,
              name: product.name,
              price: product.price,
              sellingPrice: product.sellingPrice,
            },
            quantity: item.quantity,
            discount: itemDiscount,
          });
        }
      }

      return res.status(200).json({
        success: true,
        data: {
          valid: true,
          coupon: {
            id: coupon._id,
            code: coupon.code,
            type: coupon.type,
            discountAmt: coupon.discountAmt,
            discountPercentage: coupon.discountPercentage,
            maxDiscount: coupon.maxDiscount,
            products: coupon.products,
          },
          totalDiscount,
          discountDetails,
        },
      });
    }

    // If no cartId, just return the coupon details
    res.status(200).json({
      success: true,
      data: {
        valid: true,
        coupon: {
          id: coupon._id,
          code: coupon.code,
          type: coupon.type,
          discountAmt: coupon.discountAmt,
          discountPercentage: coupon.discountPercentage,
          maxDiscount: coupon.maxDiscount,
          products: coupon.products,
        },
      },
    });
  }
);

/**
 * Validate a coupon code
 * @route GET /api/coupons/validate/:code
 * @access Public
 */
export const validateCoupon = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const code = req.params.code.toUpperCase();
    const storeId = req.query.store as string;

    if (!storeId) {
      return next(new AppError("Store ID is required", 400));
    }

    // Find the coupon
    const coupon = await Coupon.findOne({
      code,
      store: storeId,
      isActive: true,
      isDeleted: false,
    });

    if (!coupon) {
      return next(new AppError("Invalid coupon code", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        valid: true,
        coupon: {
          id: coupon._id,
          code: coupon.code,
          type: coupon.type,
          discountAmt: coupon.discountAmt,
          discountPercentage: coupon.discountPercentage,
          maxDiscount: coupon.maxDiscount,
          products: coupon.products,
        },
      },
    });
  }
);

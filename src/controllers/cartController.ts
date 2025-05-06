import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { Cart } from "../models/Cart";
import { Product } from "../models/Product";
import { Store } from "../models/Store";
import { Coupon } from "../models/Coupon";
import { Offer } from "../models/Offer";
import { AppError, catchAsync } from "../middlewares/errorHandler";

/**
 * Add item to cart
 * @route POST /api/cart/add-item
 * @access Private
 */
export const addItemToCart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    const { store, product, quantity, variant, size } = req.body;

    // Check if store exists
    const storeDoc = await Store.findById(store);
    if (!storeDoc) {
      return next(new AppError("Store not found", 404));
    }

    // Check if product exists and belongs to the store
    const productDoc = await Product.findOne({
      _id: product,
      store_id: store,
      isDeleted: false,
    });

    if (!productDoc) {
      return next(
        new AppError("Product not found or does not belong to this store", 404)
      );
    }

    // Check if product has enough inventory
    if (productDoc.inventory < quantity) {
      return next(
        new AppError("Not enough inventory available for this product", 400)
      );
    }

    // Find or create cart for this user and store
    let cart = await Cart.findOne({
      user: userId,
      store,
      state: "active",
      isDeleted: false,
    });

    if (!cart) {
      // Create new cart
      cart = await Cart.create({
        user: userId,
        store,
        items: [],
      });
    }

    // Check if product already exists in cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === product
    );

    if (existingItemIndex !== -1) {
      // Update existing item
      cart.items[existingItemIndex].quantity = quantity;
      if (variant) cart.items[existingItemIndex].variant = variant;
      if (size) cart.items[existingItemIndex].size = size;
    } else {
      // Add new item
      cart.items.push({
        product,
        quantity,
        variant: variant || null,
        size: size || null,
        effectivePrice: 0, // Will be calculated in pre-save hook
        price: 0,
        discountAmt: 0,
        discountPercentage: 0,
        couponDiscount: 0,
        couponDiscountPercentage: 0,
        offerDiscount: 0,
        offerDiscountPercentage: 0,
      });
    }

    // Save cart (prices will be calculated in pre-save hook)
    await cart.save();

    // Populate cart items with product details
    await cart.populate({
      path: "items.product",
      select: "name mainImage price sellingPrice",
    });

    res.status(200).json({
      status: "success",
      data: { cart },
    });
  }
);

/**
 * Remove item from cart
 * @route DELETE /api/cart/remove-item/:productId
 * @access Private
 */
export const removeItemFromCart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    const productId = req.params.productId;

    // Find cart
    const cart = await Cart.findOne({
      user: userId,
      state: "active",
      isDeleted: false,
    });

    if (!cart) {
      return next(new AppError("Cart not found", 404));
    }

    // Check if product exists in cart
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return next(new AppError("Product not found in cart", 404));
    }

    // Remove item
    cart.items.splice(itemIndex, 1);

    // If cart is empty, soft delete it
    if (cart.items.length === 0) {
      cart.isDeleted = true;
      cart.deletedAt = new Date();
    }

    // Save cart
    await cart.save();

    // If cart was deleted, return empty response
    if (cart.isDeleted) {
      return res.status(204).json({
        status: "success",
        data: null,
      });
    }

    // Populate cart items with product details
    await cart.populate({
      path: "items.product",
      select: "name mainImage price sellingPrice",
    });

    res.status(200).json({
      status: "success",
      data: { cart },
    });
  }
);

/**
 * Update product quantity in cart
 * @route PATCH /api/cart/update-quantity/:productId
 * @access Private
 */
export const updateProductQuantity = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    const productId = req.params.productId;
    const { quantity, variant, size } = req.body;

    // Find cart
    const cart = await Cart.findOne({
      user: userId,
      state: "active",
      isDeleted: false,
    });

    if (!cart) {
      return next(new AppError("Cart not found", 404));
    }

    // Check if product exists in cart
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return next(new AppError("Product not found in cart", 404));
    }

    // Check if product has enough inventory
    const product = await Product.findById(productId);
    if (!product) {
      return next(new AppError("Product not found", 404));
    }

    if (product.inventory < quantity) {
      return next(
        new AppError("Not enough inventory available for this product", 400)
      );
    }

    // Update item
    cart.items[itemIndex].quantity = quantity;
    if (variant !== undefined) cart.items[itemIndex].variant = variant;
    if (size !== undefined) cart.items[itemIndex].size = size;

    // Save cart
    await cart.save();

    // Populate cart items with product details
    await cart.populate({
      path: "items.product",
      select: "name mainImage price sellingPrice",
    });

    res.status(200).json({
      status: "success",
      data: { cart },
    });
  }
);

/**
 * Clear cart
 * @route DELETE /api/cart/clear
 * @access Private
 */
export const clearCart = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  // Find cart
  const cart = await Cart.findOne({
    user: userId,
    state: "active",
    isDeleted: false,
  });

  if (!cart) {
    return res.status(204).json({
      status: "success",
      data: null,
    });
  }

  // Soft delete cart
  cart.isDeleted = true;
  cart.deletedAt = new Date();
  await cart.save();

  res.status(204).json({
    status: "success",
    data: null,
  });
});

/**
 * Apply coupon to cart
 * @route POST /api/cart/apply-coupon
 * @access Private
 */
export const applyCoupon = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    const { couponCode } = req.body;
    console.log(couponCode)

    // Find cart
    const cart = await Cart.findOne({
      user: userId,
      state: "active",
      isDeleted: false,
    });

    if (!cart) {
      return next(new AppError("Cart not found", 404));
    }

    // Find coupon
    const coupon = await Coupon.findOne({
      code: couponCode.toUpperCase(),
      store: cart.store,
      isActive: true,
      isDeleted: false,
    });

    if (!coupon) {
      return next(new AppError("Invalid coupon code", 404));
    }

    // Apply coupon
    cart.coupon = coupon._id;

    // Save cart (prices will be recalculated in pre-save hook)
    await cart.save();

    // Populate cart items with product details
    await cart.populate([
      {
        path: "items.product",
        select: "name mainImage price sellingPrice",
      },
      {
        path: "coupon",
        select: "code type discountAmt discountPercentage maxDiscount",
      },
    ]);

    res.status(200).json({
      status: "success",
      data: { cart },
    });
  }
);

/**
 * Apply offer to cart
 * @route POST /api/cart/apply-offer
 * @access Private
 */
export const applyOffer = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    const { offerId } = req.body;

    // Find cart
    const cart = await Cart.findOne({
      user: userId,
      state: "active",
      isDeleted: false,
    });

    if (!cart) {
      return next(new AppError("Cart not found", 404));
    }

    // Find offer
    const offer = await Offer.findOne({
      _id: offerId,
      store: cart.store,
      isActive: true,
      isDeleted: false,
    });

    if (!offer) {
      return next(new AppError("Invalid offer", 404));
    }

    // Apply offer
    cart.offer = offer._id;

    // Save cart (prices will be recalculated in pre-save hook)
    await cart.save();

    // Populate cart items with product details
    await cart.populate([
      {
        path: "items.product",
        select: "name mainImage price sellingPrice",
      },
      {
        path: "offer",
        select: "type discountAmt discountPercentage maxDiscount",
      },
    ]);

    res.status(200).json({
      status: "success",
      data: { cart },
    });
  }
);

/**
 * Remove coupon from cart
 * @route DELETE /api/cart/remove-coupon
 * @access Private
 */
export const removeCoupon = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;

    // Find cart
    const cart = await Cart.findOne({
      user: userId,
      state: "active",
      isDeleted: false,
    });

    if (!cart) {
      return next(new AppError("Cart not found", 404));
    }

    // Remove coupon
    cart.coupon = undefined;

    // Save cart (prices will be recalculated in pre-save hook)
    await cart.save();

    // Populate cart items with product details
    await cart.populate({
      path: "items.product",
      select: "name mainImage price sellingPrice",
    });

    res.status(200).json({
      status: "success",
      data: { cart },
    });
  }
);

/**
 * Remove offer from cart
 * @route DELETE /api/cart/remove-offer
 * @access Private
 */
export const removeOffer = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;

    // Find cart
    const cart = await Cart.findOne({
      user: userId,
      state: "active",
      isDeleted: false,
    });

    if (!cart) {
      return next(new AppError("Cart not found", 404));
    }

    // Remove offer
    cart.offer = undefined;

    // Save cart (prices will be recalculated in pre-save hook)
    await cart.save();

    // Populate cart items with product details
    await cart.populate({
      path: "items.product",
      select: "name mainImage price sellingPrice",
    });

    res.status(200).json({
      status: "success",
      data: { cart },
    });
  }
);

/**
 * Get user's cart
 * @route GET /api/cart
 * @query storeId - Optional store ID to filter cart by store
 * @access Private
 */
export const getCart = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { storeId } = req.query;

  // Build query filter
  const filter: any = {
    user: userId,
    state: "active",
    isDeleted: false,
  };

  // Add store filter if storeId is provided
  if (storeId) {
    filter.store = storeId;
  }

  // Find cart
  const cart = await Cart.findOne(filter).populate([
    {
      path: "items.product",
      select: "name mainImage price sellingPrice inventory",
    },
    {
      path: "coupon",
      select: "code type discountAmt discountPercentage maxDiscount",
    },
    {
      path: "offer",
      select: "type discountAmt discountPercentage maxDiscount",
    },
    {
      path: "store",
      select: "name logo",
    },
  ]);

  if (!cart) {
    return res.status(200).json({
      status: "success",
      data: { cart: null },
    });
  }

  // Calculate cart totals
  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const productDiscount = cart.items.reduce(
    (sum, item) => sum + item.discountAmt * item.quantity,
    0
  );

  const couponDiscount = cart.items.reduce(
    (sum, item) => sum + item.couponDiscount * item.quantity,
    0
  );

  const offerDiscount = cart.items.reduce(
    (sum, item) => sum + item.offerDiscount * item.quantity,
    0
  );

  const total = cart.items.reduce(
    (sum, item) => sum + item.effectivePrice * item.quantity,
    0
  );

  res.status(200).json({
    status: "success",
    data: {
      cart,
      summary: {
        subtotal,
        productDiscount,
        couponDiscount,
        offerDiscount,
        total,
      },
    },
  });
});

/**
 * Get cart item count
 * @route GET /api/cart/count
 * @query storeId - Optional store ID to filter cart by store
 * @access Private
 */
export const getCartItemCount = catchAsync(
  async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { storeId } = req.query;

    // Build query filter
    const filter: any = {
      user: userId,
      state: "active",
      isDeleted: false,
    };

    // Add store filter if storeId is provided
    if (storeId) {
      filter.store = storeId;
    }

    // Find cart
    const cart = await Cart.findOne(filter);

    if (!cart) {
      return res.status(200).json({
        status: "success",
        data: { count: 0 },
      });
    }

    // Calculate total items count
    const count = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    res.status(200).json({
      status: "success",
      data: { count },
    });
  }
);

/**
 * Check if product is in cart and get quantity
 * @route GET /api/cart/check/:productId
 * @query storeId - Optional store ID to filter cart by store
 * @access Private
 */
export const checkProductInCart = catchAsync(
  async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const productId = req.params.productId;
    const { storeId } = req.query;

    // Build query filter
    const filter: any = {
      user: userId,
      state: "active",
      isDeleted: false,
    };

    // Add store filter if storeId is provided
    if (storeId) {
      filter.store = storeId;
    }

    // Find cart
    const cart = await Cart.findOne(filter);

    if (!cart) {
      return res.status(200).json({
        status: "success",
        data: {
          inCart: false,
          quantity: 0,
        },
      });
    }

    // Check if product exists in cart
    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );

    res.status(200).json({
      status: "success",
      data: {
        inCart: !!item,
        quantity: item ? item.quantity : 0,
      },
    });
  }
);

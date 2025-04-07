import { Request, Response, NextFunction } from "express";
import { Offer } from "../models/Offer";
import { Store } from "../models/Store";
import { Product } from "../models/Product";
import { AppError, catchAsync } from "../middlewares/errorHandler";

/**
 * Create a new offer
 * @route POST /api/offers
 * @access Private (Store Owner)
 */
export const createOffer = catchAsync(
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
        new AppError("You are not authorized to create offers for this store", 403)
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

    // Create offer
    const offer = await Offer.create(req.body);

    res.status(201).json({
      status: "success",
      data: { offer },
    });
  }
);

/**
 * Get all offers for a store
 * @route GET /api/offers
 * @access Private (Store Owner)
 */
export const getOffers = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const storeId = req.query.store as string;
  
  // If storeId is provided, check if user is the owner
  if (storeId) {
    const store = await Store.findById(storeId);
    if (store && store.owner_id.toString() !== userId) {
      return res.status(403).json({
        status: "error",
        message: "You are not authorized to view offers for this store",
      });
    }
  }
  
  // Build query
  const query: any = {};
  
  if (storeId) {
    query.store = storeId;
  } else {
    // If no storeId provided, get all offers for stores owned by the user
    const stores = await Store.find({ owner_id: userId });
    const storeIds = stores.map(store => store._id);
    query.store = { $in: storeIds };
  }
  
  const offers = await Offer.find(query)
    .populate({
      path: "products",
      select: "name mainImage price sellingPrice",
    })
    .sort({ createdAt: -1 });
  
  res.status(200).json({
    status: "success",
    results: offers.length,
    data: { offers },
  });
});

/**
 * Get a single offer
 * @route GET /api/offers/:id
 * @access Private (Store Owner)
 */
export const getOffer = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    const offerId = req.params.id;
    
    const offer = await Offer.findById(offerId).populate({
      path: "products",
      select: "name mainImage price sellingPrice",
    });
    
    if (!offer) {
      return next(new AppError("Offer not found", 404));
    }
    
    // Check if user is the store owner
    const store = await Store.findById(offer.store);
    if (!store || store.owner_id.toString() !== userId) {
      return next(
        new AppError("You are not authorized to view this offer", 403)
      );
    }
    
    res.status(200).json({
      status: "success",
      data: { offer },
    });
  }
);

/**
 * Update an offer
 * @route PATCH /api/offers/:id
 * @access Private (Store Owner)
 */
export const updateOffer = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    const offerId = req.params.id;
    
    // Find the offer
    const offer = await Offer.findById(offerId);
    if (!offer) {
      return next(new AppError("Offer not found", 404));
    }
    
    // Check if user is the store owner
    const store = await Store.findById(offer.store);
    if (!store || store.owner_id.toString() !== userId) {
      return next(
        new AppError("You are not authorized to update this offer", 403)
      );
    }
    
    // Validate products if provided
    if (req.body.products && req.body.products.length > 0) {
      const productCount = await Product.countDocuments({
        _id: { $in: req.body.products },
        store_id: offer.store,
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
    
    // Update offer
    const updatedOffer = await Offer.findByIdAndUpdate(
      offerId,
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
      data: { offer: updatedOffer },
    });
  }
);

/**
 * Delete an offer
 * @route DELETE /api/offers/:id
 * @access Private (Store Owner)
 */
export const deleteOffer = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    const offerId = req.params.id;
    
    // Find the offer
    const offer = await Offer.findById(offerId);
    if (!offer) {
      return next(new AppError("Offer not found", 404));
    }
    
    // Check if user is the store owner
    const store = await Store.findById(offer.store);
    if (!store || store.owner_id.toString() !== userId) {
      return next(
        new AppError("You are not authorized to delete this offer", 403)
      );
    }
    
    // Soft delete
    offer.isDeleted = true;
    offer.deletedAt = new Date();
    await offer.save();
    
    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);

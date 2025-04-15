import { Request, Response, NextFunction } from "express";
import { StoreImages } from "../models/StoreImages";
import { Store } from "../models/Store";
import { AppError, catchAsync } from "../middlewares/errorHandler";

/**
 * Create a new store images collection
 * @route POST /api/store-images
 * @access Private
 */
export const createStoreImages = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { store, heading, images } = req.body;
    const userId = (req as any).user.id;

    // Check if store exists
    const storeExists = await Store.findById(store);
    if (!storeExists) {
      return next(new AppError("Store not found", 404));
    }

    // Check if user owns the store
    if (storeExists.owner_id.toString() !== userId) {
      return next(
        new AppError("You are not authorized to add images to this store", 403)
      );
    }

    // Create store images collection
    const storeImages = await StoreImages.create({
      store,
      heading,
      images,
    });

    res.status(201).json({
      status: "success",
      data: { storeImages },
    });
  }
);

/**
 * Get all image collections for a store
 * @route GET /api/store-images/store/:storeId
 * @access Public
 */
export const getStoreImagesCollections = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { storeId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Check if store exists
    const storeExists = await Store.findById(storeId);
    if (!storeExists) {
      return next(new AppError("Store not found", 404));
    }

    // Get all image collections for the store
    const storeImagesCollections = await StoreImages.find({ store: storeId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await StoreImages.countDocuments({ store: storeId });

    res.status(200).json({
      status: "success",
      results: storeImagesCollections.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
      data: { storeImagesCollections },
    });
  }
);

/**
 * Get a specific image collection
 * @route GET /api/store-images/:id
 * @access Public
 */
export const getStoreImagesCollection = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const storeImagesCollection = await StoreImages.findById(id);
    if (!storeImagesCollection) {
      return next(new AppError("Image collection not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: { storeImagesCollection },
    });
  }
);

/**
 * Update a store images collection
 * @route PATCH /api/store-images/:id
 * @access Private
 */
export const updateStoreImagesCollection = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = (req as any).user.id;

    // Find the image collection
    const storeImagesCollection = await StoreImages.findById(id);
    if (!storeImagesCollection) {
      return next(new AppError("Image collection not found", 404));
    }

    // Check if user owns the store
    const store = await Store.findById(storeImagesCollection.store);
    if (!store) {
      return next(new AppError("Store not found", 404));
    }

    if (store.owner_id.toString() !== userId) {
      return next(
        new AppError("You are not authorized to update this image collection", 403)
      );
    }

    // Update the image collection
    const updatedStoreImagesCollection = await StoreImages.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "success",
      data: { storeImagesCollection: updatedStoreImagesCollection },
    });
  }
);

/**
 * Delete a store images collection
 * @route DELETE /api/store-images/:id
 * @access Private
 */
export const deleteStoreImagesCollection = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = (req as any).user.id;

    // Find the image collection
    const storeImagesCollection = await StoreImages.findById(id);
    if (!storeImagesCollection) {
      return next(new AppError("Image collection not found", 404));
    }

    // Check if user owns the store
    const store = await Store.findById(storeImagesCollection.store);
    if (!store) {
      return next(new AppError("Store not found", 404));
    }

    if (store.owner_id.toString() !== userId) {
      return next(
        new AppError("You are not authorized to delete this image collection", 403)
      );
    }

    // Soft delete the image collection
    await StoreImages.findByIdAndUpdate(id, {
      isDeleted: true,
      deletedAt: new Date(),
    });

    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);

/**
 * Restore a deleted store images collection
 * @route PATCH /api/store-images/:id/restore
 * @access Private (Admin)
 */
export const restoreStoreImagesCollection = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    // Find the image collection including soft-deleted ones
    const storeImagesCollection = await StoreImages.findOne({
      _id: id,
      includeSoftDeleted: true,
    });

    if (!storeImagesCollection) {
      return next(new AppError("Image collection not found", 404));
    }

    if (!storeImagesCollection.isDeleted) {
      return next(new AppError("Image collection is not deleted", 400));
    }

    // Restore the image collection
    storeImagesCollection.isDeleted = false;
    storeImagesCollection.deletedAt = undefined;
    await storeImagesCollection.save();

    res.status(200).json({
      status: "success",
      data: { storeImagesCollection },
    });
  }
);

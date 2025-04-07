import { Request, Response, NextFunction } from "express";
import { Address } from "../models/Address";
import { AppError, catchAsync } from "../middlewares/errorHandler";

/**
 * Add a new address
 * @route POST /api/addresses
 * @access Private
 */
export const addAddress = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  // Check if this is the first address for the user
  const addressCount = await Address.countDocuments({
    user: userId,
    isDeleted: false,
  });
  const isDefault = addressCount === 0; // First address is automatically set as default

  const address = await Address.create({
    ...req.body,
    user: userId,
    isDefault,
  });

  res.status(201).json({
    status: "success",
    data: { address },
  });
});

/**
 * Get a single address
 * @route GET /api/addresses/:id
 * @access Private
 */
export const getAddress = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;

    const address = await Address.findOne({
      _id: req.params.id,
      user: userId,
      isDeleted: false,
    });

    if (!address) {
      return next(new AppError("Address not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: { address },
    });
  }
);

/**
 * Update an address
 * @route PATCH /api/addresses/:id
 * @access Private
 */
export const updateAddress = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;

    const address = await Address.findOne({
      _id: req.params.id,
      user: userId,
      isDeleted: false,
    });

    if (!address) {
      return next(new AppError("Address not found", 404));
    }

    // Update address fields
    const allowedFields = [
      "country",
      "state",
      "city",
      "pincode",
      "houseDetails",
      "streetAddress",
      "directionToReach",
      "googleFetchedAddress",
      "type",
      "coordinates",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        (address as any)[field] = req.body[field];
      }
    });

    await address.save();

    res.status(200).json({
      status: "success",
      data: { address },
    });
  }
);

/**
 * Set an address as default
 * @route PATCH /api/addresses/:id/set-default
 * @access Private
 */
export const setDefaultAddress = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;

    const address = await Address.findOne({
      _id: req.params.id,
      user: userId,
      isDeleted: false,
    });

    if (!address) {
      return next(new AppError("Address not found", 404));
    }

    // If already default, no need to update
    if (address.isDefault) {
      return res.status(200).json({
        status: "success",
        data: { address },
      });
    }

    // Remove default status from all other addresses
    await Address.updateMany(
      { user: userId, isDefault: true },
      { isDefault: false }
    );

    // Set this address as default
    address.isDefault = true;
    await address.save();

    res.status(200).json({
      status: "success",
      data: { address },
    });
  }
);

/**
 * Soft delete address
 * @route DELETE /api/addresses/:id
 * @access Private
 */
export const deleteAddress = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;

    const address = await Address.findOne({
      _id: req.params.id,
      user: userId,
      isDeleted: false,
    });

    if (!address) {
      return next(new AppError("Address not found", 404));
    }

    // If this is the default address and there are other addresses,
    // set another address as default
    if (address.isDefault) {
      const anotherAddress = await Address.findOne({
        user: userId,
        _id: { $ne: address._id },
        isDeleted: false,
      });

      if (anotherAddress) {
        anotherAddress.isDefault = true;
        await anotherAddress.save();
      }
    }

    // Perform soft delete
    address.isDeleted = true;
    address.deletedAt = new Date();
    await address.save();

    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);

/**
 * Restore soft-deleted address
 * @route PATCH /api/addresses/:id/restore
 * @access Private
 */
export const restoreAddress = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;

    const address = await Address.findOne(
      {
        _id: req.params.id,
        user: userId,
        isDeleted: true,
      },
      null,
      { includeSoftDeleted: true }
    );

    if (!address) {
      return next(new AppError("Address not found", 404));
    }

    address.isDeleted = false;
    address.deletedAt = undefined;
    await address.save();

    res.status(200).json({
      status: "success",
      data: { address },
    });
  }
);

/**
 * Get all addresses including deleted ones (admin only)
 * @route GET /api/addresses/all
 * @access Private/Admin
 */
export const getAllAddressesWithDeleted = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if user is admin
    if ((req as any).user.role !== "admin") {
      return next(new AppError("Not authorized to access this route", 403));
    }

    const addresses = await Address.find({}, null, {
      includeSoftDeleted: true,
    });

    res.status(200).json({
      status: "success",
      results: addresses.length,
      data: { addresses },
    });
  }
);

// Update the getAddresses method to optionally include deleted addresses
export const getAddresses = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const includeDeleted =
    req.query.includeDeleted === "true" && (req as any).user.role === "admin";

  const addresses = await Address.find({ user: userId }, null, {
    includeSoftDeleted: includeDeleted,
  });

  res.status(200).json({
    status: "success",
    results: addresses.length,
    data: { addresses },
  });
});

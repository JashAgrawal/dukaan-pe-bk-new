import { Request, Response, NextFunction } from "express";
import { ServiceType } from "../models/ServiceType";
import { AppError, catchAsync } from "../middlewares/errorHandler";
import { Store } from "../models/Store";

/**
 * Create a new service type
 * @route POST /api/service-types
 * @access Private/Admin
 */
export const createServiceType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const serviceType = await ServiceType.create(req.body);

    res.status(201).json({
      status: "success",
      data: { serviceType },
    });
  }
);

/**
 * Get all service types
 * @route GET /api/service-types
 * @access Public
 */
export const getServiceTypes = catchAsync(async (req: Request, res: Response) => {
  const serviceTypes = await ServiceType.find();

  res.status(200).json({
    status: "success",
    results: serviceTypes.length,
    data: { serviceTypes },
  });
});

/**
 * Get a single service type
 * @route GET /api/service-types/:id
 * @access Public
 */
export const getServiceType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const serviceType = await ServiceType.findById(req.params.id);

    if (!serviceType) {
      return next(new AppError("Service type not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: { serviceType },
    });
  }
);

/**
 * Update a service type
 * @route PATCH /api/service-types/:id
 * @access Private/Admin
 */
export const updateServiceType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Don't allow changing the name of a service type
    if (req.body.name) {
      delete req.body.name;
    }

    const serviceType = await ServiceType.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!serviceType) {
      return next(new AppError("Service type not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: { serviceType },
    });
  }
);

/**
 * Delete a service type (soft delete)
 * @route DELETE /api/service-types/:id
 * @access Private/Admin
 */
export const deleteServiceType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const serviceType = await ServiceType.findById(req.params.id);

    if (!serviceType) {
      return next(new AppError("Service type not found", 404));
    }

    // Check if there are any stores using this service type
    const storeCount = await Store.countDocuments({ 
      type: serviceType.name,
      isDeleted: false
    });

    if (storeCount > 0) {
      return next(
        new AppError(
          `Cannot delete service type because it is used by ${storeCount} stores`,
          400
        )
      );
    }

    // Soft delete
    serviceType.isDeleted = true;
    serviceType.deletedAt = new Date();
    await serviceType.save();

    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);

/**
 * Restore a deleted service type
 * @route PATCH /api/service-types/:id/restore
 * @access Private/Admin
 */
export const restoreServiceType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const serviceType = await ServiceType.findOne(
      { _id: req.params.id, isDeleted: true },
      null,
      { includeSoftDeleted: true }
    );

    if (!serviceType) {
      return next(new AppError("Deleted service type not found", 404));
    }

    // Restore
    serviceType.isDeleted = false;
    serviceType.deletedAt = undefined;
    await serviceType.save();

    res.status(200).json({
      status: "success",
      data: { serviceType },
    });
  }
);

/**
 * Get service type by name
 * @route GET /api/service-types/name/:name
 * @access Public
 */
export const getServiceTypeByName = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const serviceType = await ServiceType.findOne({ name: req.params.name });

    if (!serviceType) {
      return next(new AppError("Service type not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: { serviceType },
    });
  }
);

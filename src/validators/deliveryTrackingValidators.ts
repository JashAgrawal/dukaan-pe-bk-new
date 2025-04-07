import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../middlewares/errorHandler";

// Validate update tracking status request
export const validateUpdateTrackingStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      status: Joi.string()
        .valid(
          "pending",
          "processing",
          "shipped",
          "out_for_delivery",
          "delivered",
          "failed",
          "returned",
          "cancelled"
        )
        .messages({
          "any.only": "Invalid status",
        }),
      description: Joi.string()
        .when("status", {
          is: Joi.exist(),
          then: Joi.required(),
          otherwise: Joi.optional(),
        })
        .messages({
          "string.empty": "Description is required when status is provided",
          "any.required": "Description is required when status is provided",
        }),
      location: Joi.string().allow("", null),
      trackingNumber: Joi.string().allow("", null),
      courierName: Joi.string().allow("", null),
      courierWebsite: Joi.string().uri().allow("", null).messages({
        "string.uri": "Courier website must be a valid URL",
      }),
      estimatedDeliveryDate: Joi.date().iso().allow("", null).messages({
        "date.base": "Estimated delivery date must be a valid date",
        "date.format": "Estimated delivery date must be in ISO format",
      }),
    }).or(
      "status",
      "trackingNumber",
      "courierName",
      "courierWebsite",
      "estimatedDeliveryDate"
    );

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    next();
  }
);

// Validate add tracking details request
export const validateAddTrackingDetails = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      trackingNumber: Joi.string().allow("", null),
      courierName: Joi.string().allow("", null),
      courierWebsite: Joi.string().uri().allow("", null).messages({
        "string.uri": "Courier website must be a valid URL",
      }),
      estimatedDeliveryDate: Joi.date().iso().allow("", null).messages({
        "date.base": "Estimated delivery date must be a valid date",
        "date.format": "Estimated delivery date must be in ISO format",
      }),
      status: Joi.string()
        .valid(
          "pending",
          "processing",
          "shipped",
          "out_for_delivery",
          "delivered",
          "failed",
          "returned",
          "cancelled"
        )
        .default("processing")
        .messages({
          "any.only": "Invalid status",
        }),
      description: Joi.string().default("Order is being processed"),
      location: Joi.string().allow("", null),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    next();
  }
);

export default {
  validateUpdateTrackingStatus,
  validateAddTrackingDetails,
};

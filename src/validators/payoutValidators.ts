import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../middlewares/errorHandler";

// Validate generate payout request
export const validateGeneratePayout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      storeId: Joi.string().required().messages({
        "string.empty": "Store ID is required",
        "any.required": "Store ID is required",
      }),
      orderIds: Joi.array().items(Joi.string()).min(1).required().messages({
        "array.base": "Order IDs must be an array",
        "array.min": "At least one order ID is required",
        "any.required": "Order IDs are required",
      }),
      platformFeePercentage: Joi.number().min(0).max(100).default(10).messages({
        "number.base": "Platform fee percentage must be a number",
        "number.min": "Platform fee percentage must be at least 0",
        "number.max": "Platform fee percentage cannot exceed 100",
      }),
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

// Validate process payout request
export const validateProcessPayout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      transactionId: Joi.string().required().messages({
        "string.empty": "Transaction ID is required",
        "any.required": "Transaction ID is required",
      }),
      transactionReference: Joi.string().allow("", null),
      notes: Joi.string().allow("", null),
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
  validateGeneratePayout,
  validateProcessPayout,
};

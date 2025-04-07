import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../middlewares/errorHandler";

// Validate create order request
export const validateCreateOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      cartId: Joi.string().required().messages({
        "string.empty": "Cart ID is required",
        "any.required": "Cart ID is required",
      }),
      paymentType: Joi.string()
        .valid("card", "netbanking", "wallet", "upi", "emi", "cod")
        .required()
        .messages({
          "string.empty": "Payment type is required",
          "any.required": "Payment type is required",
          "any.only": "Invalid payment type",
        }),
      deliveryAddressId: Joi.string().required().messages({
        "string.empty": "Delivery address ID is required",
        "any.required": "Delivery address ID is required",
      }),
      specialNoteBuyer: Joi.string().allow("", null),
      specialNoteSeller: Joi.string().allow("", null),
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

// Validate cancel order request
export const validateCancelOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      reason: Joi.string().required().messages({
        "string.empty": "Cancellation reason is required",
        "any.required": "Cancellation reason is required",
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

// Validate cancel order items request
export const validateCancelOrderItems = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      items: Joi.array().items(Joi.number().min(0)).min(1).required().messages({
        "array.base": "Items must be an array",
        "array.min": "At least one item must be selected for cancellation",
        "any.required": "Items are required",
      }),
      reason: Joi.string().required().messages({
        "string.empty": "Cancellation reason is required",
        "any.required": "Cancellation reason is required",
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

// Validate update order status request
export const validateUpdateOrderStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      status: Joi.string()
        .valid(
          "pending",
          "confirmed",
          "processing",
          "shipped",
          "delivered",
          "cancelled",
          "returned",
          "partially_cancelled",
          "partially_returned"
        )
        .required()
        .messages({
          "string.empty": "Status is required",
          "any.required": "Status is required",
          "any.only": "Invalid status",
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

export default {
  validateCreateOrder,
  validateCancelOrder,
  validateCancelOrderItems,
  validateUpdateOrderStatus,
};

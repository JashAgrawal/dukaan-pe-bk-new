import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../middlewares/errorHandler";

// Validate create Razorpay order request
export const validateCreateRazorpayOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    const schema = Joi.object({
      orderId: Joi.string().required().messages({
        "string.empty": "Order ID is required",
        "any.required": "Order ID is required",
      }),
      // Currency is optional, will be fetched from order if not provided
      currency: Joi.string().default("INR"),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      console.log(error);
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    next();
  }
);

// Validate verify payment request
export const validateVerifyPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      orderId: Joi.string().required().messages({
        "string.empty": "Order ID is required",
        "any.required": "Order ID is required",
      }),
      razorpayOrderId: Joi.string().required().messages({
        "string.empty": "Razorpay order ID is required",
        "any.required": "Razorpay order ID is required",
      }),
      razorpayPaymentId: Joi.string().required().messages({
        "string.empty": "Razorpay payment ID is required",
        "any.required": "Razorpay payment ID is required",
      }),
      razorpaySignature: Joi.string().required().messages({
        "string.empty": "Razorpay signature is required",
        "any.required": "Razorpay signature is required",
      }),
    });
    console.log(req.body);
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

// Validate process refund request
export const validateProcessRefund = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      amount: Joi.number().positive().messages({
        "number.base": "Amount must be a number",
        "number.positive": "Amount must be positive",
      }),
      reason: Joi.string().allow("", null),
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
  validateCreateRazorpayOrder,
  validateVerifyPayment,
  validateProcessRefund,
};

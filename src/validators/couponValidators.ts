import Joi from "joi";

export const couponSchema = Joi.object({
  store: Joi.string().required().messages({
    "string.empty": "Store ID is required",
    "any.required": "Store ID is required",
  }),
  code: Joi.string().required().messages({
    "string.empty": "Coupon code is required",
    "any.required": "Coupon code is required",
  }),
  discountAmt: Joi.number().min(0).default(0).messages({
    "number.min": "Discount amount cannot be negative",
  }),
  discountPercentage: Joi.number().min(0).max(100).default(0).messages({
    "number.min": "Discount percentage cannot be negative",
    "number.max": "Discount percentage cannot exceed 100%",
  }),
  type: Joi.string().valid("amount", "percentage").required().messages({
    "string.empty": "Discount type is required",
    "any.required": "Discount type is required",
    "any.only": "Discount type must be either 'amount' or 'percentage'",
  }),
  maxDiscount: Joi.number().min(0).default(0).messages({
    "number.min": "Maximum discount cannot be negative",
  }),
  isActive: Joi.boolean().default(true),
  products: Joi.array().items(Joi.string()).default([]),
});

export const couponUpdateSchema = Joi.object({
  code: Joi.string(),
  discountAmt: Joi.number().min(0).messages({
    "number.min": "Discount amount cannot be negative",
  }),
  discountPercentage: Joi.number().min(0).max(100).messages({
    "number.min": "Discount percentage cannot be negative",
    "number.max": "Discount percentage cannot exceed 100%",
  }),
  type: Joi.string().valid("amount", "percentage").messages({
    "any.only": "Discount type must be either 'amount' or 'percentage'",
  }),
  maxDiscount: Joi.number().min(0).messages({
    "number.min": "Maximum discount cannot be negative",
  }),
  isActive: Joi.boolean(),
  products: Joi.array().items(Joi.string()),
});

export const availableCouponsSchema = Joi.object({
  storeId: Joi.string().required().messages({
    "string.empty": "Store ID is required",
    "any.required": "Store ID is required",
  }),
  cartId: Joi.string().messages({
    "string.empty": "Cart ID must be a valid ID",
  }),
});

export const validateCouponSchema = Joi.object({
  couponCode: Joi.string().required().messages({
    "string.empty": "Coupon code is required",
    "any.required": "Coupon code is required",
  }),
  storeId: Joi.string().required().messages({
    "string.empty": "Store ID is required",
    "any.required": "Store ID is required",
  }),
  cartId: Joi.string().messages({
    "string.empty": "Cart ID must be a valid ID",
  }),
});

import Joi from "joi";

export const offerSchema = Joi.object({
  store: Joi.string().required().messages({
    "string.empty": "Store ID is required",
    "any.required": "Store ID is required",
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

export const offerUpdateSchema = Joi.object({
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

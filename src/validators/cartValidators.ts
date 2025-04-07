import Joi from "joi";

export const addToCartSchema = Joi.object({
  store: Joi.string().required().messages({
    "string.empty": "Store ID is required",
    "any.required": "Store ID is required",
  }),
  product: Joi.string().required().messages({
    "string.empty": "Product ID is required",
    "any.required": "Product ID is required",
  }),
  quantity: Joi.number().integer().min(1).default(1).messages({
    "number.base": "Quantity must be a number",
    "number.integer": "Quantity must be an integer",
    "number.min": "Quantity must be at least 1",
  }),
  variant: Joi.string().allow(null, "").default(null),
  size: Joi.string().allow(null, "").default(null),
});

export const updateCartItemSchema = Joi.object({
  quantity: Joi.number().integer().min(1).required().messages({
    "number.base": "Quantity must be a number",
    "number.integer": "Quantity must be an integer",
    "number.min": "Quantity must be at least 1",
    "any.required": "Quantity is required",
  }),
  variant: Joi.string().allow(null, ""),
  size: Joi.string().allow(null, ""),
});

export const applyCouponSchema = Joi.object({
  couponCode: Joi.string().required().messages({
    "string.empty": "Coupon code is required",
    "any.required": "Coupon code is required",
  }),
});

export const applyOfferSchema = Joi.object({
  offerId: Joi.string().required().messages({
    "string.empty": "Offer ID is required",
    "any.required": "Offer ID is required",
  }),
});

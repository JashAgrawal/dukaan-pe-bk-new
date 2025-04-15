import Joi from "joi";
import mongoose from "mongoose";

// Helper function to validate MongoDB ObjectId
const objectIdValidator = (value: string, helpers: any) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

export const productReviewSchema = Joi.object({
  product: Joi.string().required().custom(objectIdValidator).messages({
    "string.empty": "Product ID is required",
    "any.invalid": "Product ID must be a valid ID",
  }),
  rating: Joi.number().required().min(1).max(5).messages({
    "number.base": "Rating must be a number",
    "number.min": "Rating must be at least 1",
    "number.max": "Rating cannot be more than 5",
    "any.required": "Rating is required",
  }),
  review: Joi.string().required().messages({
    "string.empty": "Review text is required",
  }),
  images: Joi.array().items(Joi.string()).messages({
    "array.base": "Images must be an array of strings",
  }),
  tags: Joi.array().items(Joi.string()).messages({
    "array.base": "Tags must be an array of strings",
  }),
});

export const productReviewUpdateSchema = Joi.object({
  rating: Joi.number().min(1).max(5).messages({
    "number.base": "Rating must be a number",
    "number.min": "Rating must be at least 1",
    "number.max": "Rating cannot be more than 5",
  }),
  review: Joi.string().messages({
    "string.empty": "Review text cannot be empty",
  }),
  images: Joi.array().items(Joi.string()).messages({
    "array.base": "Images must be an array of strings",
  }),
  tags: Joi.array().items(Joi.string()).messages({
    "array.base": "Tags must be an array of strings",
  }),
});

import Joi from "joi";
import mongoose from "mongoose";

// Helper function to validate MongoDB ObjectId
const objectIdValidator = (value: string, helpers: any) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

export const storeImagesSchema = Joi.object({
  heading: Joi.string().required().messages({
    "string.empty": "Heading is required",
  }),
  store: Joi.string().required().custom(objectIdValidator).messages({
    "string.empty": "Store ID is required",
    "any.invalid": "Store ID must be a valid ID",
  }),
  images: Joi.array().items(Joi.string()).min(1).required().messages({
    "array.base": "Images must be an array",
    "array.min": "At least one image is required",
    "any.required": "Images are required",
  }),
});

export const storeImagesUpdateSchema = Joi.object({
  heading: Joi.string().messages({
    "string.empty": "Heading cannot be empty",
  }),
  images: Joi.array().items(Joi.string()).min(1).messages({
    "array.base": "Images must be an array",
    "array.min": "At least one image is required",
  }),
});

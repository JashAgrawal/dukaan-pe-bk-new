import Joi from "joi";
import mongoose from "mongoose";

// Helper function to validate MongoDB ObjectId
const objectIdValidator = (value: string, helpers: any) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

// Variant option schema
const variantOptionSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Variant name is required",
  }),
  value: Joi.string().required().messages({
    "string.empty": "Variant value is required",
  }),
  price: Joi.number().min(0).messages({
    "number.min": "Price cannot be negative",
  }),
  sellingPrice: Joi.number().min(0).messages({
    "number.min": "Selling price cannot be negative",
  }),
  inventory: Joi.number().min(0).required().messages({
    "number.min": "Inventory cannot be negative",
    "any.required": "Inventory is required",
  }),
  sku: Joi.string().required().messages({
    "string.empty": "SKU is required",
  }),
});

// Size variant schema
const sizeVariantSchema = Joi.object({
  size: Joi.string().required().messages({
    "string.empty": "Size is required",
  }),
  price: Joi.number().min(0).messages({
    "number.min": "Price cannot be negative",
  }),
  sellingPrice: Joi.number().min(0).messages({
    "number.min": "Selling price cannot be negative",
  }),
  inventory: Joi.number().min(0).required().messages({
    "number.min": "Inventory cannot be negative",
    "any.required": "Inventory is required",
  }),
  sku: Joi.string().required().messages({
    "string.empty": "SKU is required",
  }),
});

export const catalogueProductSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Product name is required",
  }),
  description: Joi.string().required().messages({
    "string.empty": "Product description is required",
  }),
  mainImage: Joi.string().required().messages({
    "string.empty": "Main image is required",
  }),
  allImages: Joi.array().items(Joi.string()).messages({
    "array.base": "All images must be an array",
  }),
  type: Joi.string()
    .valid("physical", "digital", "appointment")
    .required()
    .messages({
      "string.empty": "Product type is required",
      "any.only": "Product type must be one of: physical, digital, appointment",
    }),
  price: Joi.number().min(0).required().messages({
    "number.base": "Price must be a number",
    "number.min": "Price cannot be negative",
    "any.required": "Price is required",
  }),
  sellingPrice: Joi.number().min(0).required().messages({
    "number.base": "Selling price must be a number",
    "number.min": "Selling price cannot be negative",
    "any.required": "Selling price is required",
  }),
  sizeVariants: Joi.array().items(sizeVariantSchema).messages({
    "array.base": "Size variants must be an array",
  }),
  variants: Joi.array().items(variantOptionSchema).messages({
    "array.base": "Variants must be an array",
  }),
  category: Joi.string().required().custom(objectIdValidator).messages({
    "string.empty": "Product category is required",
    "any.invalid": "Product category must be a valid ID",
  }),
  inventory: Joi.number().min(0).required().messages({
    "number.base": "Inventory must be a number",
    "number.min": "Inventory cannot be negative",
    "any.required": "Inventory is required",
  }),
  tags: Joi.array().items(Joi.string()).messages({
    "array.base": "Tags must be an array",
  }),
});

export const catalogueProductUpdateSchema = Joi.object({
  name: Joi.string().messages({
    "string.empty": "Product name cannot be empty",
  }),
  description: Joi.string().messages({
    "string.empty": "Product description cannot be empty",
  }),
  mainImage: Joi.string().messages({
    "string.empty": "Main image cannot be empty",
  }),
  allImages: Joi.array().items(Joi.string()).messages({
    "array.base": "All images must be an array",
  }),
  type: Joi.string().valid("physical", "digital", "appointment").messages({
    "any.only": "Product type must be one of: physical, digital, appointment",
  }),
  price: Joi.number().min(0).messages({
    "number.base": "Price must be a number",
    "number.min": "Price cannot be negative",
  }),
  sellingPrice: Joi.number().min(0).messages({
    "number.base": "Selling price must be a number",
    "number.min": "Selling price cannot be negative",
  }),
  sizeVariants: Joi.array().items(sizeVariantSchema).messages({
    "array.base": "Size variants must be an array",
  }),
  variants: Joi.array().items(variantOptionSchema).messages({
    "array.base": "Variants must be an array",
  }),
  category: Joi.string().custom(objectIdValidator).messages({
    "any.invalid": "Product category must be a valid ID",
  }),
  inventory: Joi.number().min(0).messages({
    "number.base": "Inventory must be a number",
    "number.min": "Inventory cannot be negative",
  }),
  tags: Joi.array().items(Joi.string()).messages({
    "array.base": "Tags must be an array",
  }),
});

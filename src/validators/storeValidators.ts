import Joi from "joi";
import mongoose from "mongoose";

// Helper function to validate MongoDB ObjectId
const objectIdValidator = (value: string, helpers: any) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

export const storeSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Store name is required",
  }),
  tagline: Joi.string().required().messages({
    "string.empty": "Store tagline is required",
  }),
  description: Joi.string().required().messages({
    "string.empty": "Store description is required",
  }),
  business_phone_number: Joi.string()
    .required()
    .pattern(/^[0-9]{10}$/)
    .messages({
      "string.empty": "Business phone number is required",
      "string.pattern.base":
        "Business phone number must be a valid 10-digit number",
    }),
  business_email: Joi.string().required().email().messages({
    "string.empty": "Business email is required",
    "string.email": "Business email must be a valid email address",
  }),
  full_address: Joi.string().required().messages({
    "string.empty": "Full address is required",
  }),
  city: Joi.string().required().messages({
    "string.empty": "City is required",
  }),
  state: Joi.string().required().messages({
    "string.empty": "State is required",
  }),
  country: Joi.string().required().messages({
    "string.empty": "Country is required",
  }),
  serviceable_pincodes: Joi.array()
    .items(Joi.string().pattern(/^[0-9]{6}$/))
    .messages({
      "array.base": "Serviceable pincodes must be an array",
      "string.pattern.base": "Each pincode must be a valid 6-digit number",
    }),
  isPanIndia: Joi.boolean().default(false),
  type: Joi.string()
    .valid(
      "physical_product",
      "digital_product",
      "service",
      "restaurant",
      "infomercial"
    )
    .required()
    .messages({
      "string.empty": "Service type is required",
      "any.only":
        "Service type must be one of: physical_product, digital_product, service, restaurant, infomercial",
    }),
  category: Joi.string().required().custom(objectIdValidator).messages({
    "string.empty": "Store category is required",
    "any.invalid": "Store category must be a valid ID",
  }),
  productCategories: Joi.array()
    .items(Joi.string().custom(objectIdValidator))
    .messages({
      "array.base": "Product categories must be an array",
      "any.invalid": "Each product category must be a valid ID",
    }),
  logo: Joi.string().required().messages({
    "string.empty": "Store logo is required",
  }),
  coverImage: Joi.string().required().messages({
    "string.empty": "Store cover image is required",
  }),
  mainImage: Joi.string().required().messages({
    "string.empty": "Store main image is required",
  }),
  allImages: Joi.array().items(Joi.string()).messages({
    "array.base": "All images must be an array",
  }),
  location: Joi.object({
    type: Joi.string().default("Point"),
    coordinates: Joi.array().items(Joi.number()).length(2).required().messages({
      "array.length":
        "Coordinates must contain exactly 2 numbers [longitude, latitude]",
      "array.base": "Coordinates must be an array of numbers",
    }),
  }),
  isBrand: Joi.boolean().default(false),
  isOpen: Joi.boolean().default(true),
  opensAt: Joi.string()
    .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .default("09:00")
    .messages({
      "string.pattern.base": "Opens at must be in the format HH:MM (24-hour)",
    }),
  closesAt: Joi.string()
    .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .default("18:00")
    .messages({
      "string.pattern.base": "Closes at must be in the format HH:MM (24-hour)",
    }),
  is_24_7: Joi.boolean().default(false),
});

export const storeUpdateSchema = Joi.object({
  name: Joi.string().messages({
    "string.empty": "Store name cannot be empty",
  }),
  tagline: Joi.string().messages({
    "string.empty": "Store tagline cannot be empty",
  }),
  description: Joi.string().messages({
    "string.empty": "Store description cannot be empty",
  }),
  business_phone_number: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .messages({
      "string.pattern.base":
        "Business phone number must be a valid 10-digit number",
    }),
  business_email: Joi.string().email().messages({
    "string.email": "Business email must be a valid email address",
  }),
  full_address: Joi.string(),
  city: Joi.string(),
  state: Joi.string(),
  country: Joi.string(),
  serviceable_pincodes: Joi.array()
    .items(Joi.string().pattern(/^[0-9]{6}$/))
    .messages({
      "array.base": "Serviceable pincodes must be an array",
      "string.pattern.base": "Each pincode must be a valid 6-digit number",
    }),
  isPanIndia: Joi.boolean(),
  type: Joi.string()
    .valid(
      "physical_product",
      "digital_product",
      "service",
      "restaurant",
      "infomercial"
    )
    .messages({
      "any.only":
        "Service type must be one of: physical_product, digital_product, service, restaurant, infomercial",
    }),
  category: Joi.string().custom(objectIdValidator).messages({
    "any.invalid": "Store category must be a valid ID",
  }),
  productCategories: Joi.array()
    .items(Joi.string().custom(objectIdValidator))
    .messages({
      "array.base": "Product categories must be an array",
      "any.invalid": "Each product category must be a valid ID",
    }),
  logo: Joi.string(),
  coverImage: Joi.string(),
  mainImage: Joi.string(),
  allImages: Joi.array().items(Joi.string()).messages({
    "array.base": "All images must be an array",
  }),
  location: Joi.object({
    type: Joi.string().default("Point"),
    coordinates: Joi.array().items(Joi.number()).length(2).messages({
      "array.length":
        "Coordinates must contain exactly 2 numbers [longitude, latitude]",
      "array.base": "Coordinates must be an array of numbers",
    }),
  }),
  isBrand: Joi.boolean(),
  isOpen: Joi.boolean(),
  opensAt: Joi.string()
    .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .messages({
      "string.pattern.base": "Opens at must be in the format HH:MM (24-hour)",
    }),
  closesAt: Joi.string()
    .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .messages({
      "string.pattern.base": "Closes at must be in the format HH:MM (24-hour)",
    }),
  is_24_7: Joi.boolean(),
});

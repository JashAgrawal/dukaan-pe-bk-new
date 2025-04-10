import Joi from "joi";

export const productCategorySchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Category name is required",
  }),
  image: Joi.string().required().messages({
    "string.empty": "Category image is required",
  }),
  popularityIndex: Joi.number().min(0).default(0),
  noOfProducts: Joi.number().min(0).default(0),
  parentId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .allow(null)
    .messages({
      "string.pattern.base":
        "Parent category ID must be a valid MongoDB ObjectId",
    }),
});

export const productCategoryUpdateSchema = Joi.object({
  name: Joi.string().messages({
    "string.empty": "Category name cannot be empty",
  }),
  image: Joi.string().messages({
    "string.empty": "Category image cannot be empty",
  }),
  popularityIndex: Joi.number().min(0),
  noOfProducts: Joi.number().min(0),
  parentId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .allow(null)
    .messages({
      "string.pattern.base":
        "Parent category ID must be a valid MongoDB ObjectId",
    }),
});

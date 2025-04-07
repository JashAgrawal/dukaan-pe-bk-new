import Joi from 'joi';

export const storeCategorySchema = Joi.object({
  name: Joi.string()
    .required()
    .messages({
      'string.empty': 'Category name is required',
    }),
  image: Joi.string()
    .required()
    .messages({
      'string.empty': 'Category image is required',
    }),
  popularityIndex: Joi.number()
    .min(0)
    .default(0),
  noOfStores: Joi.number()
    .min(0)
    .default(0),
});

export const storeCategoryUpdateSchema = Joi.object({
  name: Joi.string()
    .messages({
      'string.empty': 'Category name cannot be empty',
    }),
  image: Joi.string()
    .messages({
      'string.empty': 'Category image cannot be empty',
    }),
  popularityIndex: Joi.number()
    .min(0),
  noOfStores: Joi.number()
    .min(0),
});

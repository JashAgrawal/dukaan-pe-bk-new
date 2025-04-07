import Joi from 'joi';
import mongoose from 'mongoose';

// Helper function to validate MongoDB ObjectId
const objectIdValidator = (value: string, helpers: any) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid');
  }
  return value;
};

export const storeReviewSchema = Joi.object({
  store: Joi.string()
    .required()
    .custom(objectIdValidator)
    .messages({
      'string.empty': 'Store ID is required',
      'any.invalid': 'Store ID must be a valid ID',
    }),
  rating: Joi.number()
    .required()
    .min(1)
    .max(5)
    .messages({
      'number.base': 'Rating must be a number',
      'number.min': 'Rating must be at least 1',
      'number.max': 'Rating cannot be more than 5',
      'any.required': 'Rating is required',
    }),
  review: Joi.string()
    .required()
    .messages({
      'string.empty': 'Review text is required',
    }),
});

export const storeReviewUpdateSchema = Joi.object({
  rating: Joi.number()
    .min(1)
    .max(5)
    .messages({
      'number.base': 'Rating must be a number',
      'number.min': 'Rating must be at least 1',
      'number.max': 'Rating cannot be more than 5',
    }),
  review: Joi.string()
    .messages({
      'string.empty': 'Review text cannot be empty',
    }),
});

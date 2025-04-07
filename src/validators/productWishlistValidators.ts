import Joi from 'joi';
import mongoose from 'mongoose';

// Helper function to validate MongoDB ObjectId
const objectIdValidator = (value: string, helpers: any) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid');
  }
  return value;
};

export const productWishlistSchema = Joi.object({
  product: Joi.string()
    .required()
    .custom(objectIdValidator)
    .messages({
      'string.empty': 'Product ID is required',
      'any.invalid': 'Product ID must be a valid ID',
    }),
});

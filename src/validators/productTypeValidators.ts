import Joi from 'joi';

export const productTypeSchema = Joi.object({
  name: Joi.string()
    .valid('physical', 'digital', 'appointment')
    .required()
    .messages({
      'string.empty': 'Product type name is required',
      'any.only': 'Product type must be one of: physical, digital, appointment',
    }),
  description: Joi.string()
    .required()
    .messages({
      'string.empty': 'Product type description is required',
    }),
});

export const productTypeUpdateSchema = Joi.object({
  description: Joi.string()
    .messages({
      'string.empty': 'Product type description cannot be empty',
    }),
});

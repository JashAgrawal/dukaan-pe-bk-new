import Joi from 'joi';

export const serviceTypeSchema = Joi.object({
  name: Joi.string()
    .valid('physical_product', 'digital_product', 'service', 'restaurant', 'infomercial')
    .required()
    .messages({
      'string.empty': 'Service type name is required',
      'any.only': 'Service type must be one of: physical_product, digital_product, service, restaurant, infomercial',
    }),
  description: Joi.string()
    .required()
    .messages({
      'string.empty': 'Service type description is required',
    }),
});

export const serviceTypeUpdateSchema = Joi.object({
  description: Joi.string()
    .messages({
      'string.empty': 'Service type description cannot be empty',
    }),
});

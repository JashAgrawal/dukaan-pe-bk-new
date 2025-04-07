import Joi from 'joi';

export const addressSchema = Joi.object({
  coordinates: Joi.array()
    .items(Joi.number())
    .length(2)
    .required()
    .messages({
      'array.length': 'Coordinates must contain exactly 2 numbers [longitude, latitude]',
      'array.base': 'Coordinates must be an array of numbers',
    }),
  country: Joi.string()
    .required()
    .messages({
      'string.empty': 'Country is required',
    }),
  state: Joi.string()
    .required()
    .messages({
      'string.empty': 'State is required',
    }),
  city: Joi.string()
    .required()
    .messages({
      'string.empty': 'City is required',
    }),
  pincode: Joi.string()
    .pattern(/^[0-9]{6}$/)
    .required()
    .messages({
      'string.empty': 'Pincode is required',
      'string.pattern.base': 'Pincode must be 6 digits',
    }),
  houseDetails: Joi.string()
    .required()
    .messages({
      'string.empty': 'House details are required',
    }),
  streetAddress: Joi.string()
    .required()
    .messages({
      'string.empty': 'Street address is required',
    }),
  directionToReach: Joi.string()
    .allow('')
    .optional(),
  googleFetchedAddress: Joi.string()
    .required()
    .messages({
      'string.empty': 'Google fetched address is required',
    }),
  type: Joi.string()
    .valid('home', 'work', 'other')
    .default('home'),
  isDefault: Joi.boolean()
    .default(false),
});
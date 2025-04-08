import Joi from "joi";

// Pincode validation schema
export const pincodeSchema = Joi.object({
  pincode: Joi.string()
    .pattern(/^[0-9]{6}$/)
    .required()
    .messages({
      "string.empty": "Pincode is required",
      "string.pattern.base": "Pincode must be a valid 6-digit number",
    }),
});

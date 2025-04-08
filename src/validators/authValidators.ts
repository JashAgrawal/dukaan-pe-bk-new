import Joi from "joi";

// Request OTP validation schema
export const requestOtpSchema = Joi.object({
  mobileNumber: Joi.string()
    .pattern(/^\+?[1-9]\d{9,14}$/)
    .required()
    .messages({
      "string.empty": "Mobile number is required",
      "string.pattern.base": "Please provide a valid mobile number",
    }),
});

// Verify OTP validation schema
export const verifyOtpSchema = Joi.object({
  mobileNumber: Joi.string()
    .pattern(/^\+?[1-9]\d{9,14}$/)
    .required()
    .messages({
      "string.empty": "Mobile number is required",
      "string.pattern.base": "Please provide a valid mobile number",
    }),
  otp: Joi.string()
    .length(6)
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      "string.empty": "OTP is required",
      "string.length": "OTP must be 6 digits",
      "string.pattern.base": "OTP must contain only numbers",
    }),
  requestId: Joi.string().required().messages({
    "string.empty": "Request ID is required",
  }),
  name: Joi.string().min(2).max(50).messages({
    "string.min": "Name must be at least 2 characters",
    "string.max": "Name cannot exceed 50 characters",
  }),
});

// Resend OTP validation schema
export const resendOtpSchema = Joi.object({
  mobileNumber: Joi.string()
    .pattern(/^\+?[1-9]\d{9,14}$/)
    .required()
    .messages({
      "string.empty": "Mobile number is required",
      "string.pattern.base": "Please provide a valid mobile number",
    }),
  requestId: Joi.string().required().messages({
    "string.empty": "Request ID is required",
  }),
});

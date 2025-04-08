import { Request, Response, NextFunction } from "express";
import { Schema } from "joi";
import { AppError } from "./errorHandler";

type ValidationType = "body" | "query" | "params";

/**
 * Validate request data against a Joi schema
 * @param schema - Joi schema to validate against
 * @param type - Type of validation (body, query, or params)
 */
export const validateRequest = (
  schema: Schema,
  type: ValidationType = "body"
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const dataToValidate =
      type === "body" ? req.body : type === "query" ? req.query : req.params;

    const { error } = schema.validate(dataToValidate, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(", ");

      return next(new AppError(errorMessage, 400));
    }

    next();
  };
};

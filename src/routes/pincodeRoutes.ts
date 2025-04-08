import { Router } from "express";
import { isPincodeServiceable } from "../controllers/pincodeController";
import { validateRequest } from "../middlewares/validationMiddleware";
import { pincodeSchema } from "../validators/pincodeValidators";

const router = Router();

// Public route
router.get(
  "/is-serviceable", 
  validateRequest(pincodeSchema, "query"), 
  isPincodeServiceable
);

export default router;

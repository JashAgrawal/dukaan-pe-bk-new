import { Router } from "express";
import {
  createOffer,
  getOffers,
  getOffer,
  updateOffer,
  deleteOffer,
} from "../controllers/offerController";
import { protect } from "../middlewares/authMiddleware";
import { validateRequest } from "../middlewares/validationMiddleware";
import { offerSchema, offerUpdateSchema } from "../validators/offerValidators";

const router = Router();

// All routes are protected
router.use(protect);

router.post("/", validateRequest(offerSchema), createOffer);
router.get("/", getOffers);
router.get("/:id", getOffer);
router.patch("/:id", validateRequest(offerUpdateSchema), updateOffer);
router.delete("/:id", deleteOffer);

export default router;

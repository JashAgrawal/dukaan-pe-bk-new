import { Request, Response } from "express";
import { Store } from "../models/Store";
import { catchAsync } from "../middlewares/errorHandler";

/**
 * Check if a pincode is serviceable by any store
 * @route GET /api/pincode/is-serviceable
 * @access Public
 */
export const isPincodeServiceable = catchAsync(
  async (req: Request, res: Response) => {
    const { pincode } = req.query;

    // Count stores that service this pincode (either directly or via pan-India)
    const storeCount = await Store.countDocuments({
      $or: [
        { serviceable_pincodes: pincode },
        { isPanIndia: true }
      ],
      isDeleted: false
    });

    // Determine if the pincode is serviceable
    const isServiceable = storeCount > 0;

    res.status(200).json({
      status: "success",
      data: {
        pincode,
        isServiceable,
        storeCount,
        message: isServiceable 
          ? `This pincode is serviceable by ${storeCount} store(s)` 
          : "This pincode is not serviceable"
      },
    });
  }
);

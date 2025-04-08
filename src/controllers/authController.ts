import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";
import { AppError, catchAsync } from "../middlewares/errorHandler";
import { logger } from "../utils/logger";

/**
 * Request OTP for authentication
 * @route POST /api/auth/request-otp
 * @access Public
 */
export const requestOtp = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { mobileNumber } = req.body;

    // Find user by mobile number or create a new one
    let user = await User.findOne({ mobileNumber }).select(
      "+otp +otpExpiry +requestId"
    );

    if (!user) {
      // Create a new user with just the mobile number
      user = new User({ mobileNumber });
    }

    // Generate OTP
    const otp = user.generateOTP();
    await user.save();

    // In a real application, send OTP via SMS
    // For now, just log it to console
    logger.info(`OTP for ${mobileNumber}: ${otp}`);

    // Send response
    res.status(200).json({
      status: "success",
      message: "OTP sent successfully",
      data: {
        requestId: user.requestId,
        expiresIn: 300, // 5 minutes in seconds
      },
    });
  }
);

/**
 * Verify OTP and login/register user
 * @route POST /api/auth/verify-otp
 * @access Public
 */
export const verifyOtp = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { mobileNumber, otp, requestId, name } = req.body;

    // Find user by mobile number
    const user = await User.findOne({ mobileNumber, requestId }).select(
      "+otp +otpExpiry"
    );

    if (!user) {
      return next(new AppError("Invalid mobile number or request ID", 400));
    }

    // Verify OTP
    if (!user.verifyOTP(otp)) {
      return next(new AppError("Invalid or expired OTP", 400));
    }

    // Check if this is a new user (no name set yet)
    const isNewUser = !user.name;

    // If new user and name is provided, update the name
    if (isNewUser && name) {
      user.name = name;
    } else if (isNewUser && !name) {
      return next(new AppError("Name is required for new users", 400));
    }

    // Clear OTP fields
    user.otp = undefined;
    user.otpExpiry = undefined;
    user.requestId = undefined;
    await user.save();

    // Generate token
    const token = user.generateAuthToken();

    // Send response
    res.status(200).json({
      status: "success",
      token,
      isNewUser,
      data: {
        user: {
          id: user._id,
          name: user.name,
          mobileNumber: user.mobileNumber,
          role: user.role,
        },
      },
    });
  }
);

/**
 * Resend OTP
 * @route POST /api/auth/resend-otp
 * @access Public
 */
export const resendOtp = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { mobileNumber, requestId } = req.body;

    // Find user by mobile number and request ID
    const user = await User.findOne({ mobileNumber, requestId }).select(
      "+otp +otpExpiry +requestId"
    );

    if (!user) {
      return next(new AppError("Invalid mobile number or request ID", 400));
    }

    // Generate new OTP
    const otp = user.generateOTP();
    await user.save();

    // In a real application, send OTP via SMS
    // For now, just log it to console
    logger.info(`OTP for ${mobileNumber}: ${otp}`);
    console.log(`OTP for ${mobileNumber}: ${otp}`);

    // Send response
    res.status(200).json({
      status: "success",
      message: "OTP resent successfully",
      data: {
        requestId: user.requestId,
        expiresIn: 300, // 5 minutes in seconds
      },
    });
  }
);

/**
 * Get current user profile
 * @route GET /api/auth/me
 * @access Private
 */
export const getMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // req.user is set by the auth middleware
    const user = await User.findById((req as any).user.id);

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        user: {
          id: user._id,
          name: user.name,
          mobileNumber: user.mobileNumber,
          role: user.role,
        },
      },
    });
  }
);

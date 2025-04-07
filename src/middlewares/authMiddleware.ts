import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../models/User";
import { AppError, catchAsync } from "./errorHandler";

// Interface for decoded JWT token
interface DecodedToken extends JwtPayload {
  id: string;
  role: string;
}

/**
 * Protect routes - only authenticated users can access
 */
export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1) Get token from header
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(
        new AppError("You are not logged in. Please log in to get access", 401)
      );
    }

    // 2) Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as DecodedToken;

    // 3) Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(
        new AppError("The user belonging to this token no longer exists", 401)
      );
    }

    // 4) Grant access to protected route
    (req as any).user = {
      id: user._id,
      role: user.role,
    };

    next();
  }
);

/**
 * Restrict routes to specific roles
 */
export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes((req as any).user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};

// Alias for protect middleware to maintain compatibility with different import styles
export const authMiddleware = protect;

import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { SignOptions } from "jsonwebtoken";
import crypto from "crypto";

// User interface
export interface IUser extends Document {
  name: string;
  mobileNumber: string;
  role: "user" | "admin" | "seller";
  otp?: string;
  otpExpiry?: Date;
  requestId?: string;
  createdAt: Date;
  updatedAt: Date;
  generateAuthToken(): string;
  generateOTP(): string;
  verifyOTP(otp: string): boolean;
}

// User schema
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    mobileNumber: {
      type: String,
      required: [true, "Please provide a mobile number"],
      unique: true,
      trim: true,
      match: [/^\+?[1-9]\d{9,14}$/, "Please provide a valid mobile number"],
    },
    otp: {
      type: String,
      select: false, // Don't return OTP by default
    },
    otpExpiry: {
      type: Date,
      select: false, // Don't return OTP expiry by default
    },
    requestId: {
      type: String,
      select: false, // Don't return request ID by default
    },
    role: {
      type: String,
      enum: ["user", "admin", "seller"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

// Generate OTP method
userSchema.methods.generateOTP = function (): string {
  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Set OTP expiry to 5 minutes from now
  this.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

  // Generate a unique request ID
  this.requestId = `otp_req_${crypto.randomBytes(12).toString("hex")}`;

  // Store the OTP
  this.otp = otp;

  return otp;
};

// Verify OTP method
userSchema.methods.verifyOTP = function (candidateOTP: string): boolean {
  // Check if OTP is valid and not expired
  return (
    this.otp === candidateOTP && this.otpExpiry && new Date() < this.otpExpiry
  );
};

// Generate JWT token
userSchema.methods.generateAuthToken = function (): string {
  const jwtSecret = process.env.JWT_SECRET as string;
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";

  const options: SignOptions = {
    expiresIn: expiresIn as jwt.SignOptions["expiresIn"],
  };

  return jwt.sign({ id: this._id, role: this.role }, jwtSecret, options);
};

// Create and export User model
export const User = mongoose.model<IUser>("User", userSchema);

export default User;

import mongoose, { Document, Schema, Query } from "mongoose";

export interface ICoupon extends Document {
  store: Schema.Types.ObjectId;
  code: string;
  discountAmt: number;
  discountPercentage: number;
  type: "amount" | "percentage";
  maxDiscount: number;
  isActive: boolean;
  products: Schema.Types.ObjectId[];
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const couponSchema = new Schema<ICoupon>(
  {
    store: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: [true, "Store is required"],
    },
    code: {
      type: String,
      required: [true, "Coupon code is required"],
      trim: true,
      uppercase: true,
    },
    discountAmt: {
      type: Number,
      default: 0,
      min: [0, "Discount amount cannot be negative"],
    },
    discountPercentage: {
      type: Number,
      default: 0,
      min: [0, "Discount percentage cannot be negative"],
      max: [100, "Discount percentage cannot exceed 100%"],
    },
    type: {
      type: String,
      enum: ["amount", "percentage"],
      required: [true, "Discount type is required"],
    },
    maxDiscount: {
      type: Number,
      default: 0,
      min: [0, "Maximum discount cannot be negative"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    products: [{
      type: Schema.Types.ObjectId,
      ref: "Product",
    }],
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Add middleware to exclude soft-deleted documents by default
couponSchema.pre(/^find/, function (this: any) {
  if (!this.getQuery().includeSoftDeleted) {
    this.where({ isDeleted: false });
  }
  delete this.getQuery().includeSoftDeleted;
});

// Validate that either discountAmt or discountPercentage is provided based on type
couponSchema.pre("save", function (next) {
  if (this.type === "amount" && this.discountAmt <= 0) {
    const error = new Error("Discount amount must be greater than 0 for amount type");
    return next(error);
  }
  
  if (this.type === "percentage" && this.discountPercentage <= 0) {
    const error = new Error("Discount percentage must be greater than 0 for percentage type");
    return next(error);
  }
  
  next();
});

// Ensure coupon code is unique per store
couponSchema.index({ store: 1, code: 1 }, { unique: true });

export const Coupon = mongoose.model<ICoupon>("Coupon", couponSchema);

export default Coupon;

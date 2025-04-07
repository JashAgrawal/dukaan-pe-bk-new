import mongoose, { Document, Schema, Query } from "mongoose";
import { Product } from "./Product";

export interface IOffer extends Document {
  store: Schema.Types.ObjectId;
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

const offerSchema = new Schema<IOffer>(
  {
    store: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: [true, "Store is required"],
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
offerSchema.pre(/^find/, function (this: any) {
  if (!this.getQuery().includeSoftDeleted) {
    this.where({ isDeleted: false });
  }
  delete this.getQuery().includeSoftDeleted;
});

// Validate that either discountAmt or discountPercentage is provided based on type
offerSchema.pre("save", function (next) {
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

// Ensure each product can only be in one active offer at a time
offerSchema.pre("save", async function (next) {
  if (this.isModified("products") || this.isModified("isActive")) {
    if (this.isActive && this.products.length > 0) {
      // Check if any of the products are already in another active offer
      const existingOffers = await Offer.find({
        _id: { $ne: this._id }, // Exclude current offer
        store: this.store,
        isActive: true,
        products: { $in: this.products },
        isDeleted: false,
      });
      
      if (existingOffers.length > 0) {
        const error = new Error("One or more products are already in another active offer");
        return next(error);
      }
    }
  }
  
  next();
});

// Ensure a store can have at most 2 active offers at a time
offerSchema.pre("save", async function (next) {
  if (this.isModified("isActive") && this.isActive) {
    // Count active offers for this store
    const activeOffersCount = await Offer.countDocuments({
      _id: { $ne: this._id }, // Exclude current offer
      store: this.store,
      isActive: true,
      isDeleted: false,
    });
    
    if (activeOffersCount >= 2) {
      const error = new Error("A store can have at most 2 active offers at a time");
      return next(error);
    }
  }
  
  next();
});

export const Offer = mongoose.model<IOffer>("Offer", offerSchema);

export default Offer;

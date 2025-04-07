import mongoose, { Document, Schema, Query, Types } from "mongoose";

export interface ICartItem {
  product: Schema.Types.ObjectId;
  quantity: number;
  variant?: string;
  size?: string;
  effectivePrice: number;
  price: number;
  discountAmt: number;
  discountPercentage: number;
  couponDiscount: number;
  couponDiscountPercentage: number;
  offerDiscount: number;
  offerDiscountPercentage: number;
}

export interface ICart extends Document {
  user: Schema.Types.ObjectId;
  store: Schema.Types.ObjectId;
  items: ICartItem[];
  coupon?: any;
  offer?: any;
  isActive: boolean;
  state: "active" | "buy-now" | "pending" | "consumed" | "cancelled";
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  calculateItemPrices(): Promise<void>;
}

const cartItemSchema = new Schema<ICartItem>({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: [true, "Product is required"],
  },
  quantity: {
    type: Number,
    default: 1,
    min: [1, "Quantity must be at least 1"],
  },
  variant: {
    type: String,
    default: null,
  },
  size: {
    type: String,
    default: null,
  },
  effectivePrice: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    default: 0,
  },
  discountAmt: {
    type: Number,
    default: 0,
  },
  discountPercentage: {
    type: Number,
    default: 0,
  },
  couponDiscount: {
    type: Number,
    default: 0,
  },
  couponDiscountPercentage: {
    type: Number,
    default: 0,
  },
  offerDiscount: {
    type: Number,
    default: 0,
  },
  offerDiscountPercentage: {
    type: Number,
    default: 0,
  },
});

const cartSchema = new Schema<ICart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    store: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: [true, "Store is required"],
    },
    items: [cartItemSchema],
    coupon: {
      type: Schema.Types.ObjectId,
      ref: "Coupon",
      default: null,
    },
    offer: {
      type: Schema.Types.ObjectId,
      ref: "Offer",
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    state: {
      type: String,
      enum: ["active", "buy-now", "pending", "consumed", "cancelled"],
      default: "active",
    },
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
cartSchema.pre(/^find/, function (this: any) {
  if (!this.getQuery().includeSoftDeleted) {
    this.where({ isDeleted: false });
  }
  delete this.getQuery().includeSoftDeleted;
});

// Ensure a user can have only one active cart per store
cartSchema.index(
  { user: 1, store: 1, state: 1 },
  {
    unique: true,
    partialFilterExpression: {
      state: "active",
      isDeleted: false,
    },
  }
);

// Method to calculate and update item prices
cartSchema.methods.calculateItemPrices = async function () {
  const Product = mongoose.model("Product");
  const Coupon = mongoose.model("Coupon");
  const Offer = mongoose.model("Offer");

  // Get coupon and offer details if applied
  let couponDetails = null;
  let offerDetails = null;

  if (this.coupon) {
    couponDetails = await Coupon.findById(this.coupon);
  }

  if (this.offer) {
    offerDetails = await Offer.findById(this.offer);
  }

  // Calculate prices for each item
  for (const item of this.items) {
    // Get product details
    const product = await Product.findById(item.product);
    if (!product) continue;

    // Set base price
    item.price = product.price;

    // Calculate product's own discount
    item.discountAmt = product.discountAmount;
    item.discountPercentage = product.discountPercentage;

    // Initialize other discounts
    item.couponDiscount = 0;
    item.couponDiscountPercentage = 0;
    item.offerDiscount = 0;
    item.offerDiscountPercentage = 0;

    // Calculate effective price starting with selling price
    let effectivePrice = product.sellingPrice;

    // Apply offer discount if applicable
    if (offerDetails && offerDetails.isActive) {
      const isProductInOffer = offerDetails.products.some(
        (p: mongoose.Types.ObjectId) => p.toString() === product._id.toString()
      );

      if (isProductInOffer || offerDetails.products.length === 0) {
        if (offerDetails.type === "percentage") {
          const offerDiscount = Math.min(
            (product.sellingPrice * offerDetails.discountPercentage) / 100,
            offerDetails.maxDiscount || Infinity
          );

          item.offerDiscount = offerDiscount;
          item.offerDiscountPercentage = offerDetails.discountPercentage;
          effectivePrice -= offerDiscount;
        } else {
          item.offerDiscount = offerDetails.discountAmt;
          item.offerDiscountPercentage = Math.round(
            (offerDetails.discountAmt / product.sellingPrice) * 100
          );
          effectivePrice -= offerDetails.discountAmt;
        }
      }
    }

    // Apply coupon discount if applicable
    if (couponDetails && couponDetails.isActive) {
      const isProductInCoupon = couponDetails.products.some(
        (p: mongoose.Types.ObjectId) => p.toString() === product._id.toString()
      );

      if (isProductInCoupon || couponDetails.products.length === 0) {
        if (couponDetails.type === "percentage") {
          const couponDiscount = Math.min(
            (product.sellingPrice * couponDetails.discountPercentage) / 100,
            couponDetails.maxDiscount || Infinity
          );

          item.couponDiscount = couponDiscount;
          item.couponDiscountPercentage = couponDetails.discountPercentage;
          effectivePrice -= couponDiscount;
        } else {
          item.couponDiscount = couponDetails.discountAmt;
          item.couponDiscountPercentage = Math.round(
            (couponDetails.discountAmt / product.sellingPrice) * 100
          );
          effectivePrice -= couponDetails.discountAmt;
        }
      }
    }

    // Ensure effective price doesn't go below zero
    item.effectivePrice = Math.max(0, effectivePrice);
  }
};

// Calculate prices before saving
cartSchema.pre("save", async function (next) {
  if (
    this.isModified("items") ||
    this.isModified("coupon") ||
    this.isModified("offer")
  ) {
    await this.calculateItemPrices();
  }
  next();
});

export const Cart = mongoose.model<ICart>("Cart", cartSchema);

export default Cart;

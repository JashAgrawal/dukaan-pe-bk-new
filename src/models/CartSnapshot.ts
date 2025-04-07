import mongoose, { Document, Schema } from "mongoose";
import { ICartItem } from "./Cart";

export interface ICartSnapshot extends Document {
  originalCartId: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  store: Schema.Types.ObjectId;
  items: ICartItem[];
  coupon?: Schema.Types.ObjectId;
  offer?: Schema.Types.ObjectId;
  totalAmount: number;
  totalDiscount: number;
  couponDiscount: number;
  offerDiscount: number;
  deliveryCharges: number;
  payableAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

const cartItemSnapshotSchema = new Schema({
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
  // Additional fields to store product details at the time of order
  productName: String,
  productImage: String,
  productSKU: String,
  productDescription: String,
});

const cartSnapshotSchema = new Schema<ICartSnapshot>(
  {
    originalCartId: {
      type: Schema.Types.ObjectId,
      ref: "Cart",
      required: [true, "Original cart ID is required"],
    },
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
    items: [cartItemSnapshotSchema],
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
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
    },
    totalDiscount: {
      type: Number,
      default: 0,
    },
    couponDiscount: {
      type: Number,
      default: 0,
    },
    offerDiscount: {
      type: Number,
      default: 0,
    },
    deliveryCharges: {
      type: Number,
      default: 0,
    },
    payableAmount: {
      type: Number,
      required: [true, "Payable amount is required"],
    },
  },
  {
    timestamps: true,
  }
);

export const CartSnapshot = mongoose.model<ICartSnapshot>(
  "CartSnapshot",
  cartSnapshotSchema
);

export default CartSnapshot;

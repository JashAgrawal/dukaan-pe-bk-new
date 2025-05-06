import mongoose, { Document, Schema } from "mongoose";
import { PaymentMethodType, PaymentStatusType } from "./Payment";

export type OrderStatusType =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned"
  | "partially_cancelled"
  | "partially_returned";

export interface IOrderItem {
  product: Schema.Types.ObjectId;
  quantity: number;
  price: number;
  discountedPrice: number;
  totalPrice: number;
  status: "active" | "cancelled" | "returned";
  cancelledAt?: Date;
  returnedAt?: Date;
  cancelReason?: string;
  returnReason?: string;
}

export type DeliveryType = "home_delivery" | "pickup";

export interface IOrder extends Document {
  orderNumber: string;
  cartSnapshot: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  store: Schema.Types.ObjectId;
  items: IOrderItem[];
  paymentType: PaymentMethodType;
  paymentStatus: PaymentStatusType;
  paymentId?: Schema.Types.ObjectId;
  totalWithoutDiscount: number;
  totalPayableAmount: number;
  totalDiscount: number;
  couponDiscount: number;
  offerDiscount: number;
  coupon?: Schema.Types.ObjectId;
  offer?: Schema.Types.ObjectId;
  deliveryCharges: number;
  deliveryTrackingId?: Schema.Types.ObjectId;
  orderStatus: OrderStatusType;
  specialNoteBuyer?: string;
  specialNoteSeller?: string;
  systemNote?: string;
  isDelivery: boolean;
  deliveryType: DeliveryType;
  deliveryAddressId: Schema.Types.ObjectId;
  isActive: boolean;
  cancelledAt?: Date;
  cancelReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: [true, "Product is required"],
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    min: [1, "Quantity must be at least 1"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
  },
  discountedPrice: {
    type: Number,
    required: [true, "Discounted price is required"],
  },
  totalPrice: {
    type: Number,
    required: [true, "Total price is required"],
  },
  status: {
    type: String,
    enum: ["active", "cancelled", "returned"],
    default: "active",
  },
  cancelledAt: {
    type: Date,
  },
  returnedAt: {
    type: Date,
  },
  cancelReason: {
    type: String,
  },
  returnReason: {
    type: String,
  },
});

const orderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: [true, "Order number is required"],
      unique: true,
    },
    cartSnapshot: {
      type: Schema.Types.ObjectId,
      ref: "CartSnapshot",
      required: [true, "Cart snapshot is required"],
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
    items: [orderItemSchema],
    paymentType: {
      type: String,
      enum: ["card", "netbanking", "wallet", "upi", "emi", "cod"],
      required: [true, "Payment type is required"],
    },
    paymentStatus: {
      type: String,
      enum: [
        "pending",
        "authorized",
        "captured",
        "refunded",
        "partially_refunded",
        "failed",
      ],
      default: "pending",
    },
    paymentId: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
    },
    totalWithoutDiscount: {
      type: Number,
      required: [true, "Total without discount is required"],
    },
    totalPayableAmount: {
      type: Number,
      required: [true, "Total payable amount is required"],
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
    coupon: {
      type: Schema.Types.ObjectId,
      ref: "Coupon",
    },
    offer: {
      type: Schema.Types.ObjectId,
      ref: "Offer",
    },
    deliveryCharges: {
      type: Number,
      default: 0,
    },
    deliveryTrackingId: {
      type: Schema.Types.ObjectId,
      ref: "DeliveryTracking",
    },
    orderStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "returned",
        "partially_cancelled",
        "partially_returned",
      ],
      default: "pending",
    },
    specialNoteBuyer: {
      type: String,
    },
    specialNoteSeller: {
      type: String,
    },
    systemNote: {
      type: String,
    },
    isDelivery: {
      type: Boolean,
      default: true,
      required: [true, "Delivery status is required"],
    },
    deliveryType: {
      type: String,
      enum: ["home_delivery", "pickup"],
      default: "home_delivery",
      required: [true, "Delivery type is required"],
    },
    deliveryAddressId: {
      type: Schema.Types.ObjectId,
      ref: "Address",
      required: [true, "Delivery address is required"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    cancelledAt: {
      type: Date,
    },
    cancelReason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Generate unique order number before saving
// Only used as a fallback if orderNumber is not set explicitly
orderSchema.pre("save", async function (next) {
  if (this.isNew && !this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    // Get count of orders for today to generate sequential number
    const todayStart = new Date(new Date().setHours(0, 0, 0, 0));
    const todayEnd = new Date(new Date().setHours(23, 59, 59, 999));

    const count = await mongoose.model("Order").countDocuments({
      createdAt: { $gte: todayStart, $lte: todayEnd },
    });

    // Format: #YYMMDD-XXXX (XXXX is sequential number for the day)
    this.orderNumber = `#${year}${month}${day}-${(count + 1)
      .toString()
      .padStart(4, "0")}`;
  }
  next();
});

// Update store's order count when a new order is created
orderSchema.post("save", async function () {
  if (this.isNew) {
    await mongoose
      .model("Store")
      .findByIdAndUpdate(this.store, { $inc: { orderCount: 1 } });
  }
});

// Indexes for faster queries
orderSchema.index({ user: 1 });
orderSchema.index({ store: 1 });
// orderNumber already has a unique index from the schema definition
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: 1 });

export const Order = mongoose.model<IOrder>("Order", orderSchema);

export default Order;

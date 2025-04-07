import mongoose, { Document, Schema } from "mongoose";

export type PaymentStatusType = 
  | "pending" 
  | "authorized" 
  | "captured" 
  | "refunded" 
  | "partially_refunded" 
  | "failed";

export type PaymentMethodType = 
  | "card" 
  | "netbanking" 
  | "wallet" 
  | "upi" 
  | "emi" 
  | "cod";

export interface IPayment extends Document {
  user: Schema.Types.ObjectId;
  order: Schema.Types.ObjectId;
  amount: number;
  currency: string;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  razorpaySignature?: string;
  paymentMethod: PaymentMethodType;
  status: PaymentStatusType;
  refundAmount?: number;
  refundReason?: string;
  refundId?: string;
  refundStatus?: string;
  refundedAt?: Date;
  paymentResponse?: any;
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: [true, "Order is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },
    currency: {
      type: String,
      default: "INR",
    },
    razorpayPaymentId: {
      type: String,
    },
    razorpayOrderId: {
      type: String,
    },
    razorpaySignature: {
      type: String,
    },
    paymentMethod: {
      type: String,
      enum: ["card", "netbanking", "wallet", "upi", "emi", "cod"],
      required: [true, "Payment method is required"],
    },
    status: {
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
    refundAmount: {
      type: Number,
    },
    refundReason: {
      type: String,
    },
    refundId: {
      type: String,
    },
    refundStatus: {
      type: String,
    },
    refundedAt: {
      type: Date,
    },
    paymentResponse: {
      type: Schema.Types.Mixed,
    },
    notes: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
paymentSchema.index({ user: 1, order: 1 });
paymentSchema.index({ razorpayPaymentId: 1 });
paymentSchema.index({ razorpayOrderId: 1 });
paymentSchema.index({ status: 1 });

export const Payment = mongoose.model<IPayment>("Payment", paymentSchema);

export default Payment;

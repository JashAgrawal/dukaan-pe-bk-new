import mongoose, { Document, Schema } from "mongoose";

export type PayoutStatusType =
  | "pending"
  | "processing"
  | "completed"
  | "failed";

export interface IPayoutItem {
  order: Schema.Types.ObjectId;
  amount: number;
  platformFee: number;
  tax: number;
  netAmount: number;
}

export interface IPayout extends Document {
  store: Schema.Types.ObjectId;
  payoutBatch: string;
  items: IPayoutItem[];
  totalAmount: number;
  totalPlatformFee: number;
  totalTax: number;
  netPayoutAmount: number;
  status: PayoutStatusType;
  payoutDate?: Date;
  transactionId?: string;
  transactionReference?: string;
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const payoutItemSchema = new Schema({
  order: {
    type: Schema.Types.ObjectId,
    ref: "Order",
    required: [true, "Order is required"],
  },
  amount: {
    type: Number,
    required: [true, "Amount is required"],
  },
  platformFee: {
    type: Number,
    required: [true, "Platform fee is required"],
  },
  tax: {
    type: Number,
    required: [true, "Tax is required"],
  },
  netAmount: {
    type: Number,
    required: [true, "Net amount is required"],
  },
});

const payoutSchema = new Schema<IPayout>(
  {
    store: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: [true, "Store is required"],
    },
    payoutBatch: {
      type: String,
      required: [true, "Payout batch is required"],
    },
    items: [payoutItemSchema],
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
    },
    totalPlatformFee: {
      type: Number,
      required: [true, "Total platform fee is required"],
    },
    totalTax: {
      type: Number,
      required: [true, "Total tax is required"],
    },
    netPayoutAmount: {
      type: Number,
      required: [true, "Net payout amount is required"],
    },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },
    payoutDate: {
      type: Date,
    },
    transactionId: {
      type: String,
    },
    transactionReference: {
      type: String,
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

// Generate unique payout batch ID before saving
payoutSchema.pre("save", async function (next) {
  if (this.isNew) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    
    // Get count of payouts for today to generate sequential number
    const todayStart = new Date(date.setHours(0, 0, 0, 0));
    const todayEnd = new Date(date.setHours(23, 59, 59, 999));
    
    const count = await mongoose.model("Payout").countDocuments({
      createdAt: { $gte: todayStart, $lte: todayEnd },
    });
    
    // Format: PAY-YYMMDD-XXXX (XXXX is sequential number for the day)
    this.payoutBatch = `PAY-${year}${month}${day}-${(count + 1)
      .toString()
      .padStart(4, "0")}`;
  }
  next();
});

// Indexes for faster queries
payoutSchema.index({ store: 1 });
payoutSchema.index({ payoutBatch: 1 });
payoutSchema.index({ status: 1 });
payoutSchema.index({ createdAt: 1 });

export const Payout = mongoose.model<IPayout>("Payout", payoutSchema);

export default Payout;

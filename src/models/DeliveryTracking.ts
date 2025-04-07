import mongoose, { Document, Schema } from "mongoose";

export type DeliveryStatusType =
  | "pending"
  | "processing"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "failed"
  | "returned"
  | "cancelled";

export interface IDeliveryUpdate {
  status: DeliveryStatusType;
  timestamp: Date;
  description: string;
  location?: string;
}

export interface IDeliveryTracking extends Document {
  order: Schema.Types.ObjectId;
  trackingNumber?: string;
  courierName?: string;
  courierWebsite?: string;
  estimatedDeliveryDate?: Date;
  currentStatus: DeliveryStatusType;
  statusUpdates: IDeliveryUpdate[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const deliveryUpdateSchema = new Schema({
  status: {
    type: String,
    enum: [
      "pending",
      "processing",
      "shipped",
      "out_for_delivery",
      "delivered",
      "failed",
      "returned",
      "cancelled",
    ],
    required: [true, "Status is required"],
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  location: {
    type: String,
  },
});

const deliveryTrackingSchema = new Schema<IDeliveryTracking>(
  {
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: [true, "Order is required"],
    },
    trackingNumber: {
      type: String,
    },
    courierName: {
      type: String,
    },
    courierWebsite: {
      type: String,
    },
    estimatedDeliveryDate: {
      type: Date,
    },
    currentStatus: {
      type: String,
      enum: [
        "pending",
        "processing",
        "shipped",
        "out_for_delivery",
        "delivered",
        "failed",
        "returned",
        "cancelled",
      ],
      default: "pending",
    },
    statusUpdates: [deliveryUpdateSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add a new status update and update the current status
deliveryTrackingSchema.methods.addStatusUpdate = function (
  status: DeliveryStatusType,
  description: string,
  location?: string
) {
  this.statusUpdates.push({
    status,
    timestamp: new Date(),
    description,
    location,
  });
  this.currentStatus = status;
  return this.save();
};

// Indexes for faster queries
deliveryTrackingSchema.index({ order: 1 });
deliveryTrackingSchema.index({ trackingNumber: 1 });
deliveryTrackingSchema.index({ currentStatus: 1 });

export const DeliveryTracking = mongoose.model<IDeliveryTracking>(
  "DeliveryTracking",
  deliveryTrackingSchema
);

export default DeliveryTracking;

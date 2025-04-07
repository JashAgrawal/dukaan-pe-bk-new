import mongoose, { Document, Schema } from "mongoose";

export type ServiceTypeEnum = 
  | "physical_product" 
  | "digital_product" 
  | "service" 
  | "restaurant" 
  | "infomercial";

export interface IServiceType extends Document {
  name: ServiceTypeEnum;
  description: string;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const serviceTypeSchema = new Schema<IServiceType>(
  {
    name: {
      type: String,
      required: [true, "Service type name is required"],
      enum: [
        "physical_product",
        "digital_product",
        "service",
        "restaurant",
        "infomercial",
      ],
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Service type description is required"],
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
serviceTypeSchema.pre(/^find/, function (this: any) {
  if (!this.getQuery().includeSoftDeleted) {
    this.where({ isDeleted: false });
  }
  delete this.getQuery().includeSoftDeleted;
});

export const ServiceType = mongoose.model<IServiceType>(
  "ServiceType",
  serviceTypeSchema
);

export default ServiceType;

import mongoose, { Document, Schema } from "mongoose";

export type ProductTypeEnum = "physical" | "digital" | "appointment";

export interface IProductType extends Document {
  name: ProductTypeEnum;
  description: string;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const productTypeSchema = new Schema<IProductType>(
  {
    name: {
      type: String,
      required: [true, "Product type name is required"],
      enum: ["physical", "digital", "appointment"],
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Product type description is required"],
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
productTypeSchema.pre(/^find/, function (this: any) {
  if (!this.getQuery().includeSoftDeleted) {
    this.where({ isDeleted: false });
  }
  delete this.getQuery().includeSoftDeleted;
});

export const ProductType = mongoose.model<IProductType>(
  "ProductType",
  productTypeSchema
);

export default ProductType;

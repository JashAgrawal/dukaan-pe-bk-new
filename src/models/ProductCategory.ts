import mongoose, { Document, Schema } from "mongoose";

export interface IProductCategory extends Document {
  name: string;
  image: string;
  popularityIndex: number;
  noOfProducts: number;
  parentId?: Schema.Types.ObjectId;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const productCategorySchema = new Schema<IProductCategory>(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      unique: true,
    },
    image: {
      type: String,
      required: [true, "Category image is required"],
    },
    popularityIndex: {
      type: Number,
      default: 0,
    },
    noOfProducts: {
      type: Number,
      default: 0,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "ProductCategory",
      default: null,
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
productCategorySchema.pre(/^find/, function (this: any) {
  if (!this.getQuery().includeSoftDeleted) {
    this.where({ isDeleted: false });
  }
  delete this.getQuery().includeSoftDeleted;
});

export const ProductCategory = mongoose.model<IProductCategory>(
  "ProductCategory",
  productCategorySchema
);

export default ProductCategory;

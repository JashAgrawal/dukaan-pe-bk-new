import mongoose, { Document, Schema } from "mongoose";

export interface IStoreCategory extends Document {
  name: string;
  image: string;
  popularityIndex: number;
  noOfStores: number;
  parentId?: Schema.Types.ObjectId;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const storeCategorySchema = new Schema<IStoreCategory>(
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
    noOfStores: {
      type: Number,
      default: 0,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "StoreCategory",
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
storeCategorySchema.pre(/^find/, function (this: any) {
  if (!this.getQuery().includeSoftDeleted) {
    this.where({ isDeleted: false });
  }
  delete this.getQuery().includeSoftDeleted;
});

export const StoreCategory = mongoose.model<IStoreCategory>(
  "StoreCategory",
  storeCategorySchema
);

export default StoreCategory;

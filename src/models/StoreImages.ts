import mongoose, { Document, Schema } from "mongoose";
import { Store } from "./Store";

export interface IStoreImages extends Document {
  heading: string;
  store: Schema.Types.ObjectId;
  images: string[];
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const storeImagesSchema = new Schema<IStoreImages>(
  {
    heading: {
      type: String,
      required: [true, "Heading is required"],
      trim: true,
    },
    store: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: [true, "Store is required"],
    },
    images: {
      type: [String],
      required: [true, "At least one image is required"],
      validate: {
        validator: function(val: string[]) {
          return val.length > 0;
        },
        message: "Images array cannot be empty"
      }
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
storeImagesSchema.pre(/^find/, function (this: any) {
  if (!this.getQuery().includeSoftDeleted) {
    this.where({ isDeleted: false });
  }
  delete this.getQuery().includeSoftDeleted;
});

export const StoreImages = mongoose.model<IStoreImages>(
  "StoreImages",
  storeImagesSchema
);

export default StoreImages;
